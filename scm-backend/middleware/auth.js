// middleware/auth.js
// This file checks if a request has a valid login token before allowing access
// Used to protect routes like "place order", "view my cart", etc.

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// PROTECT: Checks if user is logged in (has valid JWT token)
const protect = async (req, res, next) => {
  let token;

  // Token usually comes as: Authorization: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify the token is valid and not expired
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the logged-in user's info to the request (minus password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      if (req.user.isBlocked) {
        return res.status(403).json({ message: 'Your account has been blocked. Contact support.' });
      }

      next(); // user is valid, continue to the actual route
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// ADMIN ONLY: Checks if logged-in user has admin role (for admin panel routes)
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};

module.exports = { protect, adminOnly };
