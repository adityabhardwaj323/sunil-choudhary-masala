// controllers/productController.js
// Handles: View products (customer side) + Add/Edit/Delete products (admin side)

const Product = require('../models/Product');

// @route   GET /api/products
// @desc    Get all products with optional filters (category, price, search, sort)
const getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort, featured, bestseller } = req.query;

    let query = { isActive: true };

    if (category) query.category = category;
    if (featured) query.isFeatured = true;
    if (bestseller) query.isBestseller = true;
    if (search) query.$text = { $search: search };

    let products = await Product.find(query);

    // Filter by price range (checks if any variant falls in the range)
    if (minPrice || maxPrice) {
      products = products.filter(p =>
        p.variants.some(v =>
          (!minPrice || v.price >= Number(minPrice)) &&
          (!maxPrice || v.price <= Number(maxPrice))
        )
      );
    }

    // Sorting — guarded against products with an empty variants array
    // (e.g. incomplete admin data entry), which would otherwise throw
    // when reading variants[0].price and crash the whole request.
    const firstPrice = (p) => (p.variants && p.variants[0]) ? p.variants[0].price : 0;
    if (sort === 'price_low') products.sort((a, b) => firstPrice(a) - firstPrice(b));
    if (sort === 'price_high') products.sort((a, b) => firstPrice(b) - firstPrice(a));
    if (sort === 'rating') products.sort((a, b) => b.ratingAvg - a.ratingAvg);
    if (sort === 'newest') products.sort((a, b) => b.createdAt - a.createdAt);

    res.json({ count: products.length, products });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   GET /api/products/:id
// @desc    Get single product details
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   POST /api/products  (ADMIN ONLY)
// @desc    Create a new product
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   PUT /api/products/:id  (ADMIN ONLY)
// @desc    Update an existing product (price, stock, images, etc.)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   DELETE /api/products/:id  (ADMIN ONLY)
// @desc    Delete a product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
