// controllers/reviewController.js
// Handles: Submit review, get reviews for a product, admin approve/delete

const Review = require('../models/Review');
const Product = require('../models/Product');

// @route   GET /api/reviews/:productId
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, isApproved: true }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Shared helper: recalculate a product's displayed rating from only its
// approved reviews, so the average/count always match what's publicly shown.
const recalcProductRating = async (productId) => {
  const approvedReviews = await Review.find({ product: productId, isApproved: true });
  const avgRating = approvedReviews.length
    ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length
    : 0;
  await Product.findByIdAndUpdate(productId, {
    ratingAvg: avgRating.toFixed(1),
    ratingCount: approvedReviews.length
  });
};

// @route   POST /api/reviews/:productId
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId;
    const userId = req.user._id;

    // 1. Verify that the user has actually purchased and received the product.
    // Must be Delivered, not Cancelled, and belong to the user.
    const Order = require('../models/Order');
    const validOrder = await Order.findOne({
      user: userId,
      orderStatus: 'Delivered',
      'items.product': productId
    });

    if (!validOrder) {
      return res.status(403).json({ message: 'You can only review products that have been delivered to you.' });
    }

    // 2. Prevent duplicate reviews
    const existingReview = await Review.findOne({ product: productId, user: userId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product.' });
    }

    const review = await Review.create({
      product: productId,
      user: userId,
      userName: req.user.firstName,
      rating,
      comment
    });

    // Recalculate product's average rating — only from approved reviews,
    // so it matches what getProductReviews actually displays.
    await recalcProductRating(req.params.productId);

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   DELETE /api/reviews/:id  (ADMIN ONLY)
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    // Deleting a review changes the review set, so recalculate stats too —
    // otherwise ratingAvg/ratingCount go stale after every deletion.
    await recalcProductRating(review.product);

    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// @route   GET /api/reviews  (ADMIN ONLY)
// @desc    Get ALL reviews (all products, approved + pending)
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('product', 'name')
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   PUT /api/reviews/:id  (ADMIN ONLY)
// @desc    Approve or reject a review
const approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: req.body.isApproved },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: 'Review not found' });

    // Hiding/unhiding a review changes what's publicly visible, so the
    // product's displayed rating average/count need to update too.
    await recalcProductRating(review.product);

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   GET /api/reviews/public/recent
// @desc    Get recent approved reviews for public display
const getRecentPublicReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .select('userName rating comment createdAt product') // minimal fields, no private info
      .populate('product', 'name'); // only product name
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getProductReviews, addReview, deleteReview, getAllReviews, approveReview, getRecentPublicReviews };
