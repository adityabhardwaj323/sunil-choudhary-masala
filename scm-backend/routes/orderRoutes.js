// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
  createPayment, placeOrder, getMyOrders, trackOrder,
  getAllOrders, updateOrderStatus
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

// Public route — anyone with an Order ID can track it
router.get('/track/:orderId', trackOrder);

// Logged-in customer routes
router.post('/create-payment', protect, createPayment);
router.post('/', protect, placeOrder);
router.get('/my-orders', protect, getMyOrders);

// Admin-only routes
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
