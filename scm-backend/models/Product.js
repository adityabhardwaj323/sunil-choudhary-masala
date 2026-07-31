// models/Product.js
// This defines what information we store about each masala product
// The Admin Panel will Create/Edit/Delete products using this structure

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Red Chilli', 'Turmeric', 'Coriander', 'Spice Blends', 'Special Masala', 'Gift Box']
  },
  images: [
    {
      type: String // URLs/paths to product images uploaded by admin
    }
  ],
  // Each product can have multiple weight options with different prices
  variants: [
    {
      weight: { type: String, required: true }, // e.g. "100g", "250g", "500g", "1kg"
      price: { type: Number, required: true },
      mrp: { type: Number, required: true }, // original price (for showing discount)
      stock: { type: Number, default: 0 }
    }
  ],
  batchDate: {
    type: Date,
    default: Date.now
  },
  bestBefore: {
    type: Date
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isBestseller: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true // admin can deactivate without deleting
  },
  ratingAvg: {
    type: Number,
    default: 0
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  totalSold: {
    type: Number,
    default: 0
  },
  ingredients: {
    type: String
  },
  nutritionInfo: {
    energy: String,
    protein: String,
    fat: String,
    carbs: String,
    fibre: String
  },
  fssaiNumber: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Text index allows searching products by name/description
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
