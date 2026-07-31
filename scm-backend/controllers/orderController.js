// controllers/orderController.js
// Handles: Place order, Razorpay payment verification, order tracking, admin order management

const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const crypto = require('crypto');

// Razorpay setup — instantiated lazily (only when a payment is actually
// created) so the server can still boot when RAZORPAY_KEY_ID/SECRET aren't
// set yet (e.g. local dev, COD-only testing). Previously this was created
// eagerly at module load time, which crashed the ENTIRE server on startup
// (not just the orders route) whenever the Razorpay env vars were missing,
// since Razorpay's constructor throws synchronously if key_id is absent.
const Razorpay = require('razorpay');
let razorpayInstance = null;
const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env to accept online payments.');
  }
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }
  return razorpayInstance;
};

// Helper: Generate a unique order ID like SCM-2025-00123
const generateOrderId = async () => {
  const year = new Date().getFullYear();
  const count = await Order.countDocuments();
  const number = String(count + 1).padStart(5, '0');
  return `SCM-${year}-${number}`;
};

// @route   POST /api/orders/create-payment
// @desc    Create a Razorpay payment order (called before showing payment popup)
const createPayment = async (req, res) => {
  try {
    const { amount } = req.body; // amount in rupees

    const options = {
      amount: amount * 100, // Razorpay needs amount in paise
      currency: 'INR',
      receipt: 'receipt_' + Date.now()
    };

    const razorpayOrder = await getRazorpay().orders.create(options);
    res.json(razorpayOrder);
  } catch (error) {
    res.status(500).json({ message: 'Payment initialization failed', error: error.message });
  }
};

// @route   POST /api/orders
// @desc    Place a new order (after payment success, or for COD)
const placeOrder = async (req, res) => {
  try {
    const {
      items, shippingAddress, paymentMethod,
      subtotal, shippingCharge, discount, couponCode, totalAmount,
      razorpayOrderId, razorpayPaymentId, razorpaySignature
    } = req.body;

    // If paid via Razorpay, verify the payment signature for security
    if (paymentMethod !== 'COD' && razorpayPaymentId) {
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(razorpayOrderId + '|' + razorpayPaymentId)
        .digest('hex');

      if (generatedSignature !== razorpaySignature) {
        return res.status(400).json({ message: 'Payment verification failed' });
      }
    }

    const orderId = await generateOrderId();

    const order = await Order.create({
      orderId,
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      subtotal,
      shippingCharge,
      discount,
      couponCode,
      totalAmount,
      statusHistory: [{ status: 'Processing', note: 'Order placed successfully' }]
    });

    // Reduce stock for each ordered item
    for (const item of items) {
      await Product.updateOne(
        { _id: item.product, 'variants.weight': item.weight },
        { $inc: { 'variants.$.stock': -item.quantity, totalSold: item.quantity } }
      );
    }

    // Increment the coupon's usage count so usageLimit checks in
    // validateCoupon actually work — this was never being incremented
    // anywhere before, so limited-use coupons could be reused indefinitely.
    if (couponCode) {
      await Coupon.updateOne({ code: couponCode.toUpperCase() }, { $inc: { usedCount: 1 } });
    }

    // Clear the user's cart after order is placed
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   GET /api/orders/my-orders
// @desc    Get logged-in user's order history
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   GET /api/orders/track/:orderId
// @desc    Track an order by Order ID (public-ish, but should verify ownership in production)
const trackOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ message: 'Order not found. Please check your Order ID.' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ───────────────────────────────────────────────
// ADMIN ROUTES
// ───────────────────────────────────────────────

// @route   GET /api/orders  (ADMIN ONLY)
// @desc    Get all orders (for admin dashboard)
const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { orderStatus: status } : {};
    const orders = await Order.find(query).populate('user', 'firstName lastName email phone').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   PUT /api/orders/:id/status  (ADMIN ONLY)
// @desc    Update order status (Processing → Shipped → Delivered etc.)
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.orderStatus = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    order.statusHistory.push({ status, note: note || `Order ${status}` });

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createPayment, placeOrder, getMyOrders, trackOrder,
  getAllOrders, updateOrderStatus
};
