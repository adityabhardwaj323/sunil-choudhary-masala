// controllers/productController.js
// Handles: View products (customer side) + Add/Edit/Delete products (admin side)

const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

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

// @route   POST /api/products/upload-images  (ADMIN ONLY)
// @desc    Upload one or more product images to Cloudinary and return their
//          public, permanent URLs. The frontend then includes these URLs in
//          the `images` array when calling createProduct/updateProduct —
//          this endpoint only handles image storage, it does not touch any
//          Product document itself.
const uploadProductImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files were uploaded' });
    }

    // multer.memoryStorage() gives us each file as a Buffer (req.files[i].buffer)
    // rather than a path on disk. Cloudinary's SDK accepts a base64 data URI
    // directly, so we convert in memory and upload — no local file ever touches disk.
    const uploads = await Promise.all(
      req.files.map(file => {
        const base64 = file.buffer.toString('base64');
        const dataUri = `data:${file.mimetype};base64,${base64}`;
        return cloudinary.uploader.upload(dataUri, {
          folder: 'scm-products',
          resource_type: 'image'
        });
      })
    );

    const urls = uploads.map(result => result.secure_url);
    res.json({ urls });
  } catch (error) {
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, uploadProductImages };
