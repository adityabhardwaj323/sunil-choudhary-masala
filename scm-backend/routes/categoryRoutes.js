// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAvailableCategories,
  getCategories,
  createCategory,
  updateCategory,
  removeCategoryImage,
  getCategoryUsage
} = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public route to fetch available categories (merged from base + products)
router.get('/available', getAvailableCategories);

// Public route to fetch category metadata (images)
router.get('/', getCategories);

// Admin-only routes
router.post('/', protect, adminOnly, upload.single('image'), createCategory);
router.put('/:id', protect, adminOnly, upload.single('image'), updateCategory);
router.delete('/:id/image', protect, adminOnly, removeCategoryImage);
router.get('/:id/usage', protect, adminOnly, getCategoryUsage);

module.exports = router;
