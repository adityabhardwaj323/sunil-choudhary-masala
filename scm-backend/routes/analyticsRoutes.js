// routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analyticsController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, getAnalytics);

module.exports = router;
