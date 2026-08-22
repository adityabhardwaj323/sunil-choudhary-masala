const express = require('express');
const router = express.Router();
const { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog } = require('../controllers/blogController');
const { protect, adminOnly } = require('../middleware/auth');
const uploadCms = require('../middleware/uploadCms');

// Public routes for Blog
router.get('/', getBlogs);
router.get('/:id', getBlogById);

// Admin-only routes
router.post('/', protect, adminOnly, uploadCms.single('featuredImage'), createBlog);
router.put('/:id', protect, adminOnly, uploadCms.single('featuredImage'), updateBlog);
router.delete('/:id', protect, adminOnly, deleteBlog);

module.exports = router;
