// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const {
  getProducts, getProductById, createProduct, updateProduct, deleteProduct
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes (anyone can view products)
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only routes (require login + admin role)
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
