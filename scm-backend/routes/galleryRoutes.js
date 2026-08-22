const express = require('express');
const router = express.Router();
const { getGalleryImages, createGalleryImage, updateGalleryImage, deleteGalleryImage, getUsage } = require('../controllers/galleryController');
const { protect, adminOnly } = require('../middleware/auth');
const uploadCms = require('../middleware/uploadCms');

// Public route for Gallery
router.get('/', getGalleryImages);
// Admin route for Usage
router.get('/usage', protect, adminOnly, getUsage);

// Admin-only routes
router.post('/', protect, adminOnly, uploadCms.single('image'), createGalleryImage);
router.put('/:id', protect, adminOnly, uploadCms.single('image'), updateGalleryImage);
router.delete('/:id', protect, adminOnly, deleteGalleryImage);

module.exports = router;
