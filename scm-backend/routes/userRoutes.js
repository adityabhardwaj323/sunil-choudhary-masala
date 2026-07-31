// routes/userRoutes.js
// Admin-only route to manage customers

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

// @route  GET /api/users  (ADMIN ONLY)
// @desc   Get all customers with their order counts
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Attach order count to each user
    const usersWithOrders = await Promise.all(users.map(async (u) => {
      const orderCount = await Order.countDocuments({ user: u._id });
      const totalSpent = await Order.aggregate([
        { $match: { user: u._id, paymentStatus: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);
      return {
        ...u.toObject(),
        orderCount,
        totalSpent: totalSpent[0]?.total || 0
      };
    }));

    res.json(usersWithOrders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route  PUT /api/users/:id  (ADMIN ONLY)
// @desc   Block or unblock a customer
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: req.body.isBlocked },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route  GET /api/users/:id/orders  (ADMIN ONLY)
// @desc   Get all orders for a specific customer
router.get('/:id/orders', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
