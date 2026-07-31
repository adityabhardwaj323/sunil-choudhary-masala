// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const { getProductReviews, addReview, deleteReview, getAllReviews, approveReview } = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middleware/auth');

// Admin: get ALL reviews across all products
router.get('/', protect, adminOnly, getAllReviews);

// Customer: get approved reviews for a specific product
router.get('/:productId', getProductReviews);

// Customer: add a review
router.post('/:productId', protect, addReview);

// Admin: approve / reject a review
router.put('/:id', protect, adminOnly, approveReview);

// Admin: delete a review
router.delete('/:id', protect, adminOnly, deleteReview);

module.exports = router;
