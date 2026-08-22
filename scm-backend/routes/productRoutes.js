// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const {
  getProducts, getProductById, createProduct, updateProduct, deleteProduct, uploadProductImages
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes (anyone can view products)
router.get('/', getProducts);

// Admin-only routes (require login + admin role)
// IMPORTANT: this must be declared BEFORE router.get('/:id', ...) further down
// so that "upload-images" isn't swallowed as if it were a product ID param.
router.post('/upload-images', protect, adminOnly, upload.array('images', 8), uploadProductImages);

router.get('/:id', getProductById);
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
