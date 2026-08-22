// controllers/orderController.js
// Handles: Place order, Razorpay payment verification, order tracking, admin order management
// Phase 5A: Server-side amount calculation — NEVER trust client-supplied financial values.

const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Settings = require('../models/Settings');
const crypto = require('crypto');
const { orderConfirmation, paymentConfirmation, orderStatusUpdate, refundUpdate } = require('../utils/emailTemplates');
const sendEmail = require('../utils/sendEmail');

// Helper for idempotent email sending
const sendOrderEmail = async (order, eventKey, subject, htmlContent) => {
  if (!order.shippingAddress || !order.shippingAddress.email || (order.emailNotificationHistory && order.emailNotificationHistory.includes(eventKey))) return;
  
  try {
    await sendEmail({
      email: order.shippingAddress.email,
      subject,
      message: subject,
      html: htmlContent
    });
    await Order.updateOne(
      { _id: order._id },
      { $addToSet: { emailNotificationHistory: eventKey } }
    );
    if (!order.emailNotificationHistory) order.emailNotificationHistory = [];
    order.emailNotificationHistory.push(eventKey);
  } catch (error) {
    console.error(`Failed to send email (${eventKey}) for order ${order.orderId}:`, error.message);
  }
};

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

// ─── SHARED: Server-side cart validation & amount calculation ───────────
// Used by BOTH createPayment and placeOrder so amounts are always consistent.
// NEVER trusts any client-supplied financial values.
const validateAndCalculate = async (userId, paymentMethod, couponCode) => {
  // 1. Read the actual cart from MongoDB
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart || !cart.items || cart.items.length === 0) {
    return { error: 'Your cart is empty', status: 400 };
  }

  // 2. Validate each item: product exists, is active, variant exists, stock is sufficient
  const verifiedItems = [];
  for (const cartItem of cart.items) {
    const product = cartItem.product;
    if (!product) {
      return { error: `Product not found for cart item`, status: 400 };
    }
    if (!product.isActive) {
      return { error: `"${product.name}" is no longer available`, status: 400 };
    }

    const variant = product.variants.find(v => v.weight === cartItem.weight);
    if (!variant) {
      return { error: `Weight option "${cartItem.weight}" is no longer available for "${product.name}"`, status: 400 };
    }

    if (variant.stock < cartItem.quantity) {
      return {
        error: `Insufficient stock for "${product.name}" (${cartItem.weight}). Available: ${variant.stock}, requested: ${cartItem.quantity}`,
        status: 400
      };
    }

    verifiedItems.push({
      product: product._id,
      name: product.name,
      weight: cartItem.weight,
      price: variant.price, // SERVER-VERIFIED price, not client price
      quantity: cartItem.quantity,
      image: (product.images && product.images[0]) || ''
    });
  }

  // 3. Calculate subtotal from server-verified prices
  const subtotal = verifiedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // 4. Read delivery configuration from Settings
  const settings = await Settings.findOne();
  if (!settings) {
    return { error: 'Shop settings not configured', status: 500 };
  }

  // 5. Calculate delivery charge from deliveryRanges
  let shippingCharge = 0;
  const ranges = settings.deliveryRanges || [];
  const enabledRanges = ranges.filter(r => r.enabled !== false);
  for (const range of enabledRanges) {
    const max = range.maxOrderValue === null ? Infinity : range.maxOrderValue;
    if (subtotal >= range.minOrderValue && subtotal <= max) {
      shippingCharge = range.charge;
      break;
    }
  }

  // 6. Calculate COD charge if applicable
  let codCharge = 0;
  if (paymentMethod === 'COD') {
    if (!settings.codEnabled) {
      return { error: 'Cash on Delivery is currently not available', status: 400 };
    }
    codCharge = settings.codCharge || 0;
  }

    // 7. Apply coupon/discount if provided
  let discount = 0;
  let validatedCouponCode = null;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (coupon && coupon.isActive) {
      if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
        return { error: 'This coupon has expired', status: 400 };
      } else if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
        return { error: 'This coupon has reached its usage limit', status: 400 };
      } else if (subtotal < coupon.minOrderValue) {
        return { error: `Minimum order value of ₹${coupon.minOrderValue} required`, status: 400 };
      } else {
        if (coupon.isFirstOrderOnly) {
          const previousOrderCount = await Order.countDocuments({ user: userId, paymentStatus: { $ne: 'Failed' } });
          if (previousOrderCount > 0) {
            return { error: 'This first-order offer is only available to new customers.', status: 400 };
          }
        }
        // Calculate discount
        discount = Math.round(subtotal * coupon.discountPercent / 100);
        if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
          discount = coupon.maxDiscountAmount;
        }
        validatedCouponCode = coupon.code;
      }
    } else {
      return { error: 'Invalid or inactive coupon code', status: 400 };
    }
  }

  // 8. Calculate final total
  const totalAmount = Math.max(0, subtotal + shippingCharge + codCharge - discount);

  return {
    cart,
    verifiedItems,
    subtotal,
    shippingCharge,
    codCharge,
    discount,
    couponCode: validatedCouponCode,
    totalAmount,
    settings
  };
};


// @route   POST /api/orders/create-payment
// @desc    Create a Razorpay payment order — amount is calculated SERVER-SIDE
const createPayment = async (req, res) => {
  try {
    const { paymentMethod, couponCode } = req.body;

    // Server-side calculation — ignoring any client-provided amount
    const result = await validateAndCalculate(req.user._id, paymentMethod || 'Online', couponCode);
    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }

    const { totalAmount } = result;

    const options = {
      amount: Math.round(totalAmount * 100), // Razorpay needs amount in paise
      currency: 'INR',
      receipt: 'receipt_' + Date.now()
    };

    const razorpayOrder = await getRazorpay().orders.create(options);

    // Return the Razorpay order + the server-calculated amount for UI display
    res.json({
      ...razorpayOrder,
      serverCalculatedAmount: totalAmount
    });
  } catch (error) {
    res.status(500).json({ message: 'Payment initialization failed', error: error.message });
  }
};

// @route   POST /api/orders
// @desc    Place a new order — ALL amounts recalculated server-side
const placeOrder = async (req, res) => {
  try {
    const {
      shippingAddress, paymentMethod, couponCode,
      razorpayOrderId, razorpayPaymentId, razorpaySignature
    } = req.body;

    // ── Duplicate payment protection ──
    if (razorpayPaymentId) {
      const existingOrder = await Order.findOne({ razorpayPaymentId });
      if (existingOrder) {
        return res.status(409).json({
          message: 'This payment has already been processed',
          orderId: existingOrder.orderId
        });
      }
    }

    // ── Server-side recalculation — trust NOTHING from the client ──
    const result = await validateAndCalculate(req.user._id, paymentMethod, couponCode);
    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }

    const {
      verifiedItems, subtotal, shippingCharge, codCharge,
      discount, couponCode: validatedCouponCode, totalAmount
    } = result;

    // ── Razorpay payment verification ──
    if (paymentMethod !== 'COD' && razorpayPaymentId) {
      if (!razorpayOrderId || !razorpaySignature) {
        return res.status(400).json({ message: 'Missing Razorpay payment verification data' });
      }

      // Verify signature
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(razorpayOrderId + '|' + razorpayPaymentId)
        .digest('hex');

      if (generatedSignature !== razorpaySignature) {
        return res.status(400).json({ message: 'Payment verification failed — invalid signature' });
      }

      // Verify amount consistency: fetch the Razorpay order and compare amounts
      // This is MANDATORY — if we cannot verify, we do NOT create the order.
      const rzpOrder = await getRazorpay().orders.fetch(razorpayOrderId);
      const expectedPaise = Math.round(totalAmount * 100);
      if (rzpOrder.amount !== expectedPaise) {
        return res.status(400).json({
          message: 'Payment amount mismatch — the order amount does not match the server-calculated total'
        });
      }
      if (rzpOrder.status !== 'paid') {
        return res.status(400).json({
          message: 'Razorpay order is not in paid status'
        });
      }
    }

    // ── Create the order ──
    const orderId = await generateOrderId();

    const order = await Order.create({
      orderId,
      user: req.user._id,
      items: verifiedItems,      // Server-verified items with live prices
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      razorpayOrderId: razorpayOrderId || undefined,
      razorpayPaymentId: razorpayPaymentId || undefined,
      razorpaySignature: razorpaySignature || undefined,
      subtotal,                  // Server-calculated
      shippingCharge,            // Server-calculated
      discount,                  // Server-calculated
      couponCode: validatedCouponCode,
      totalAmount,               // Server-calculated
      statusHistory: [{ status: 'Processing', note: 'Order placed successfully' }]
    });

    // ── Reduce stock atomically — conditional update prevents negative stock ──
    // Each update only succeeds if current stock >= requested quantity.
    const stockDecrementedItems = [];
    for (const item of verifiedItems) {
      const updateResult = await Product.updateOne(
        {
          _id: item.product,
          'variants.weight': item.weight,
          'variants.stock': { $gte: item.quantity } // atomic guard
        },
        {
          $inc: { 'variants.$.stock': -item.quantity, totalSold: item.quantity }
        }
      );

      if (updateResult.modifiedCount === 0) {
        // Stock became insufficient between validation and decrement (concurrency).
        // Roll back any items already decremented in this loop.
        for (const prev of stockDecrementedItems) {
          await Product.updateOne(
            { _id: prev.product, 'variants.weight': prev.weight },
            { $inc: { 'variants.$.stock': prev.quantity, totalSold: -prev.quantity } }
          );
        }
        // Delete the order we just created — it cannot be fulfilled
        await Order.deleteOne({ _id: order._id });
        return res.status(409).json({
          message: `Insufficient stock for "${item.name}" (${item.weight}). Another order may have claimed the remaining units. Please try again.`
        });
      }

      stockDecrementedItems.push(item);
    }

    // ── Increment coupon usage ──
    if (validatedCouponCode) {
      await Coupon.updateOne({ code: validatedCouponCode }, { $inc: { usedCount: 1 } });
    }

    // ── Clear the user's cart ──
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    // Send order confirmation email
    await sendOrderEmail(
      order,
      'ORDER_CREATED',
      'Order Confirmed - Sunil Choudhary Masala',
      orderConfirmation(order)
    );

    // If already paid via Razorpay, send payment confirmation too
    if (order.paymentStatus === 'Paid' && order.razorpayPaymentId) {
      await sendOrderEmail(
        order,
        'PAYMENT_CONFIRMED',
        'Payment Successful - Sunil Choudhary Masala',
        paymentConfirmation(order, order.razorpayPaymentId)
      );
    }

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
// @desc    Track an order by Order ID (Ownership protected)
const trackOrder = async (req, res) => {
    try {
      const param = req.params.orderId;
      let order = await Order.findOne({ orderId: param });
      
      // Fallback: If not found by orderId, check if it's a valid MongoDB _id and try finding by _id
      if (!order && /^[0-9a-fA-F]{24}$/.test(param)) {
        order = await Order.findById(param);
      }

      if (!order) return res.status(404).json({ message: 'Order not found. Please check your Order ID.' });

    // Verify ownership: req.user._id must match order.user, unless user is admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden. You do not have permission to view this order.' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   POST /api/orders/:id/cancel
// @desc    Cancel order by customer
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    if (order.orderStatus === 'Cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }

    if (['Shipped', 'Out for Delivery', 'Delivered'].includes(order.orderStatus)) {
      return res.status(400).json({
        message: 'Cancellation is no longer available because this order has been dispatched'
      });
    }

    order.orderStatus = 'Cancelled';
    order.statusHistory.push({ status: 'Cancelled', note: 'Cancelled by customer' });

    
      if (order.paymentMethod === 'COD') {
        order.refundStatus = 'NotRequired';
      } else if (order.razorpayPaymentId) {
        order.refundStatus = 'Pending';
        try {
          const payment = await getRazorpay().payments.fetch(order.razorpayPaymentId);
          if (payment.amount_refunded >= payment.amount) {
            order.refundStatus = 'Refunded';
          } else {
            const expectedAmount = payment.amount;
            const refund = await getRazorpay().payments.refund(order.razorpayPaymentId, { amount: expectedAmount });
            order.razorpayRefundId = refund.id;
            order.refundAmount = order.totalAmount;
            order.refundInitiatedAt = new Date();
            order.refundStatus = 'Processing';
          }
        } catch (err) {
          console.error('Razorpay refund error:', err);
          order.refundFailureReason = err.message || 'Error initiating refund';
          order.refundStatus = 'Pending';
        }
      } else {
        order.refundStatus = 'Pending';
      }

    for (const item of order.items) {
      await Product.updateOne(
        { _id: item.product, 'variants.weight': item.weight },
        { $inc: { 'variants.$.stock': item.quantity, totalSold: -item.quantity } }
      );
    }

    await order.save();

    // Send cancellation email
    await sendOrderEmail(
      order,
      'ORDER_CANCELLED',
      'Order Cancelled - Sunil Choudhary Masala',
      orderStatusUpdate(order, 'Cancelled')
    );

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================================================
// ADMIN ROUTES
// ==================================================

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

    if (order.orderStatus === 'Cancelled' && status && status !== 'Cancelled') {
      return res.status(400).json({ message: 'Invalid status transition' });
    }

    if (order.orderStatus === 'Delivered' && status && status !== 'Delivered') {
      return res.status(400).json({ message: 'Invalid status transition' });
    }

    if (status === 'Cancelled' && order.orderStatus !== 'Cancelled') {
      order.orderStatus = 'Cancelled';
      order.statusHistory.push({ status: 'Cancelled', note: note || 'Cancelled by admin' });

      if (order.paymentMethod === 'COD') {
        order.refundStatus = 'NotRequired';
      } else if (order.razorpayPaymentId) {
        if (order.razorpayRefundId) {
          // Refund already initiated locally
        } else {
          // Verify payment status before initiating refund
          try {
            const payment = await getRazorpay().payments.fetch(order.razorpayPaymentId);
            if (payment.amount_refunded >= payment.amount) {
              order.refundStatus = 'Refunded';
            } else {
              const expectedAmount = payment.amount;
              const refund = await getRazorpay().payments.refund(order.razorpayPaymentId, { amount: expectedAmount });
              order.razorpayRefundId = refund.id;
              order.refundAmount = order.totalAmount;
              order.refundInitiatedAt = new Date();
              order.refundStatus = 'Processing';
            }
          } catch (err) {
            console.error('Razorpay refund error:', err);
            order.refundFailureReason = err.message || 'Error initiating refund';
            order.refundStatus = 'Processing';
          }
        }
      } else {
        order.refundStatus = 'Processing';
      }

      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.product, 'variants.weight': item.weight },
          { $inc: { 'variants.$.stock': item.quantity, totalSold: -item.quantity } }
        );
      }
    } else if (status && status !== order.orderStatus) {
      order.orderStatus = status;
      order.statusHistory.push({ status, note: note || `Order ${status}` });
    } else if (note) {
      order.statusHistory.push({ status: order.orderStatus, note });
    }

    if (trackingNumber) order.trackingNumber = trackingNumber;

    await order.save();

    // Send status update email if status changed
    if (status) {
      const eventKey = `STATUS_${status.toUpperCase().replace(/ /g, '_')}`;
      await sendOrderEmail(
        order,
        eventKey,
        `Order Update: ${status} - Sunil Choudhary Masala`,
        orderStatusUpdate(order, status)
      );
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   POST /api/orders/webhook
// @desc    Handle Razorpay webhooks (e.g., refund.created, refund.processed, refund.failed)
const razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      console.error('Webhook secret not configured');
      return res.status(500).json({ message: 'Webhook secret not configured' });
    }

    const signature = req.headers['x-razorpay-signature'];
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(req.body.toString())
      .digest('hex');

    if (expectedSignature !== signature) {
      console.warn('Webhook signature mismatch');
      return res.status(400).json({ message: 'Invalid signature' });
    }

    // Parse the body now that signature is verified
    const payload = JSON.parse(req.body.toString());
    const event = payload.event;
    
    if (event.startsWith('refund.')) {
      const refund = payload.payload.refund.entity;
      const paymentId = refund.payment_id;
      
      const order = await Order.findOne({ razorpayPaymentId: paymentId });
      if (!order) {
        console.warn(`Order not found for payment: ${paymentId}`);
        return res.status(200).json({ message: 'Order not found, ignored' });
      }

      order.razorpayRefundId = refund.id;

      if (event === 'refund.created') {
        if (order.refundStatus !== 'Refunded') {
          order.refundStatus = 'Processing';
        }
      } else if (event === 'refund.processed') {
        order.refundStatus = 'Refunded';
        order.refundProcessedAt = new Date(refund.created_at * 1000);
      } else if (event === 'refund.failed') {
        order.refundStatus = 'Failed';
        order.refundFailureReason = refund.error_description || 'Refund failed at Razorpay';
      }

      await order.save();
      
      // Send refund update email
      if (order.refundStatus === 'Processing' || order.refundStatus === 'Refunded' || order.refundStatus === 'Failed') {
        const eventKey = `REFUND_${order.refundStatus.toUpperCase()}`;
        await sendOrderEmail(
          order,
          eventKey,
          `Refund Update - Sunil Choudhary Masala`,
          refundUpdate(order, order.refundStatus)
        );
      }
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    // Return 200 anyway so Razorpay doesn't keep retrying immediately if we have a temporary issue,
    // or depending on requirements, returning 500 will make Razorpay retry later.
    // The instructions say "Return HTTP 200 promptly after valid webhook processing."
    // Let's return 500 for parsing errors so we know, but 200 if signature matches.
    res.status(500).json({ message: 'Webhook error' });
  }
};

module.exports = {
  createPayment, placeOrder, getMyOrders, trackOrder,
  getAllOrders, updateOrderStatus, cancelOrder, razorpayWebhook
};
