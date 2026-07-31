// routes/bannerRoutes.js
const express = require('express');
const router = express.Router();
const { getAllBanners, createBanner, updateBanner, deleteBanner } = require('../controllers/bannerController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getAllBanners);                                  // public
router.post('/', protect, adminOnly, createBanner);             // admin
router.put('/:id', protect, adminOnly, updateBanner);           // admin
router.delete('/:id', protect, adminOnly, deleteBanner);        // admin

module.exports = router;
