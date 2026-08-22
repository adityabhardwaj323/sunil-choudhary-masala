const express = require('express');
const router = express.Router();
const { reverseGeocode } = require('../controllers/locationController');

// Allow this to be public or authenticated depending on checkout flow requirements
router.post('/reverse-geocode', reverseGeocode);

module.exports = router;
