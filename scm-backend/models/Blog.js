const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  featuredImageUrl: { type: String },
  featuredImagePublicId: { type: String },
  status: { type: String, default: 'published' },
  slug: { type: String, unique: true },
  excerpt: { type: String },
  author: { type: String, default: 'Admin' },
  category: { type: String, default: 'Uncategorized' },
  tags: [{ type: String }],
  publishedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Blog', blogSchema);
