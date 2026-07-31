// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const { submitContact, getAllContacts, updateContactStatus } = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', submitContact); // public — anyone can submit
router.get('/', protect, adminOnly, getAllContacts);
router.put('/:id', protect, adminOnly, updateContactStatus);

module.exports = router;
