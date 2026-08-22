// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
  createPayment, placeOrder, getMyOrders, trackOrder,
  getAllOrders, updateOrderStatus, cancelOrder
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

// Customer-only route - securely tracks an order (ownership verified in controller)
router.get('/track/:orderId', protect, trackOrder);

// Logged-in customer routes
router.post('/create-payment', protect, createPayment);
router.post('/', protect, placeOrder);
router.get('/my-orders', protect, getMyOrders);
router.post('/:id/cancel', protect, cancelOrder);

// Admin-only routes
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
