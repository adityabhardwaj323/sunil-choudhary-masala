// server.js
// This is the MAIN file that starts our backend server
// Run this file using: npm run dev (or npm start)

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to MongoDB database
connectDB();

const app = express();

// MIDDLEWARE
app.use(cors()); // allows our frontend (HTML files) to talk to this backend
app.use(express.json()); // allows server to understand JSON data sent from frontend
app.use(express.urlencoded({ extended: true }));

// Serve uploaded product images publicly
app.use('/uploads', express.static('uploads'));

// ROUTES — each feature has its own file
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));

// Test route — visit http://localhost:5000/ to check if server is running
app.get('/', (req, res) => {
  res.json({ message: '🌶️ Sunil Choudhary Masala Backend API is running!' });
});

// Handle routes that don't exist
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler (catches any unexpected errors)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
