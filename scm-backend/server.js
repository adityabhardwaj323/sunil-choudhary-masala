// server.js
// This is the MAIN file that starts our backend server
// Run this file using: npm run dev (or npm start)

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Connect to MongoDB database
connectDB();

const app = express();

// MIDDLEWARE
app.use(helmet({
  crossOriginResourcePolicy: false, // allow cross-origin images (Cloudinary)
}));

// Global Rate Limiting - generous for regular browsing
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', globalLimiter);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (no origin) like Postman or internal services
    if (!origin) return callback(null, true);
    const allowedEnv = process.env.CORS_ORIGINS || '';
    const allowed = allowedEnv.split(',').map(o => o.trim()).filter(Boolean);
    // Development fallback: if no origins configured, allow everything
    if (allowed.length === 0) return callback(null, true);
    if (allowed.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
})); // CORS hardening – allowed origins defined via CORS_ORIGINS
// We must handle the Razorpay webhook BEFORE express.json() parses the body,
// because Razorpay signature validation requires the raw request body string.
app.post('/api/orders/webhook', express.raw({ type: 'application/json' }), require('./controllers/orderController').razorpayWebhook);

// Apply sensible body size limits (e.g., 1mb instead of 10kb to allow large arrays like cart or long reviews, while blocking giant payloads)
app.use(express.json({ limit: '1mb' })); // allows server to understand JSON data sent from frontend
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// NOTE: product images are stored on Cloudinary now (see config/cloudinary.js
// and controllers/productController.js), not on local disk, so there's no
// local /uploads folder to serve anymore — Render's filesystem is ephemeral
// and would have wiped locally-stored images on every redeploy anyway.

// ROUTES — each feature has its own file
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/blog', (req, res, next) => { console.log('--- BLOG REQUEST ---'); console.log(req.method, req.url); console.log(req.headers); next(); }, require('./routes/blogRoutes'));
app.use('/api/location', require('./routes/locationRoutes'));

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

const { verifyEmailConnection } = require('./utils/sendEmail');

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  // Verify email connection after server starts
  await verifyEmailConnection();
});
