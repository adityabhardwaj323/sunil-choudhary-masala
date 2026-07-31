// routes/couponRoutes.js
const express = require('express');
const router = express.Router();
const {
  validateCoupon, createCoupon, getAllCoupons, deleteCoupon
} = require('../controllers/couponController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/validate', protect, validateCoupon);
router.post('/', protect, adminOnly, createCoupon);
router.get('/', protect, adminOnly, getAllCoupons);
router.delete('/:id', protect, adminOnly, deleteCoupon);

module.exports = router;
