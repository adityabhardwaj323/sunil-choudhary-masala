const express = require('express');
const router = express.Router();
const { getBlogs, getAdminBlogs, getBlogById, getBlogBySlug, createBlog, updateBlog, deleteBlog } = require('../controllers/blogController');
const { protect, adminOnly } = require('../middleware/auth');
const uploadCms = require('../middleware/uploadCms');

// Public routes for Blog
router.get('/', getBlogs);
router.get('/:id', getBlogById); // Keep ID route
router.get('/slug/:slug', getBlogBySlug); // Add Slug route

// Admin-only routes
router.get('/admin/all', protect, adminOnly, getAdminBlogs);
router.post('/', protect, adminOnly, uploadCms.single('featuredImage'), createBlog);
router.put('/:id', protect, adminOnly, uploadCms.single('featuredImage'), updateBlog);
router.delete('/:id', protect, adminOnly, deleteBlog);

module.exports = router;
