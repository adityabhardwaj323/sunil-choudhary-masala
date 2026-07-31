// controllers/couponController.js
// Handles: Validate coupon at checkout, Admin create/delete coupons

const Coupon = require('../models/Coupon');

// @route   POST /api/coupons/validate
// @desc    Customer applies a coupon code at checkout
const validateCoupon = async (req, res) => {
  try {
    const { code, orderValue } = req.body;
    if (!code) return res.status(400).json({ message: 'Please provide a coupon code' });
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' });
    if (coupon.expiryDate < new Date()) return res.status(400).json({ message: 'This coupon has expired' });
    if (orderValue < coupon.minOrderValue)
      return res.status(400).json({ message: `Minimum order value of ₹${coupon.minOrderValue} required` });
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
      return res.status(400).json({ message: 'This coupon has reached its usage limit' });

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
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (error) {
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
