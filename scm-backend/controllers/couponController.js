// controllers/couponController.js
// Handles: Validate coupon at checkout, Admin create/delete coupons

const Coupon = require('../models/Coupon');
const Order = require('../models/Order');

// @route   POST /api/coupons/validate
// @desc    Customer applies a coupon code at checkout
const validateCoupon = async (req, res) => {
  try {
    const { code, orderValue } = req.body;
    if (!code) return res.status(400).json({ message: 'Please provide a coupon code' });
    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase(), isActive: true });

    if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' });
    if (coupon.expiryDate < new Date()) return res.status(400).json({ message: 'This coupon has expired' });
    if (orderValue < coupon.minOrderValue)
      return res.status(400).json({ message: `Minimum order value of ₹${coupon.minOrderValue} required` });
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
      return res.status(400).json({ message: 'This coupon has reached its usage limit' });

    if (coupon.isFirstOrderOnly) {
      if (!req.user) {
        return res.status(401).json({ message: 'Please login to use this first-order offer' });
      }
      const previousOrders = await Order.countDocuments({ user: req.user._id, paymentStatus: { $ne: 'Failed' }, orderStatus: { $ne: 'Cancelled' } });
      if (previousOrders > 0) {
        return res.status(400).json({ message: 'This first-order offer is only available to new customers.' });
      }
    }

    let discount = (orderValue * coupon.discountPercent) / 100;
    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }

    res.json({ valid: true, discount: Math.round(discount), discountPercent: coupon.discountPercent });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   POST /api/coupons  (ADMIN ONLY)
const createCoupon = async (req, res) => {
  try {
    if (req.body.code) {
      req.body.code = req.body.code.trim().toUpperCase();
    }
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A coupon with this code already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   GET /api/coupons  (ADMIN ONLY)
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   DELETE /api/coupons/:id  (ADMIN ONLY)
const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { validateCoupon, createCoupon, getAllCoupons, deleteCoupon };
