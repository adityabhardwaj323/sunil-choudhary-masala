// controllers/authController.js
// Handles: Register, Login, Get logged-in user profile

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper: Creates a JWT token for a user (valid for 30 days by default)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @route   POST /api/auth/register
// @desc    Register a new customer account
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !password || (!email && !phone)) {
      return res.status(400).json({ message: 'Please provide name, password, and email or phone' });
    }

    // Check if user already exists.
    // IMPORTANT: only check fields that were actually provided. Querying
    // { email: null } would match ANY user whose email is simply absent
    // (phone-only signups), since Mongo's { field: null } matches both
    // null and "field doesn't exist". That previously caused every
    // phone-only registration after the first to be falsely rejected as
    // "already exists" (and likewise for email-only registrations).
    const dupConditions = [];
    if (email) dupConditions.push({ email: email.toLowerCase() });
    if (phone) dupConditions.push({ phone });
    const existingUser = dupConditions.length
      ? await User.findOne({ $or: dupConditions })
      : null;
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email/phone already exists' });
    }

    const user = await User.create({ firstName, lastName, email, phone, password });

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   POST /api/auth/login
// @desc    Login with email/phone + password
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier = email OR phone

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please provide email/phone and password' });
    }

    // Find user by email or phone, and include password field (normally hidden)
    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { phone: identifier }]
    }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email/phone or password' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Your account has been blocked. Contact support.' });
    }

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   GET /api/auth/me
// @desc    Get currently logged-in user's profile
const getMe = async (req, res) => {
  res.json(req.user);
};

// @route   POST /api/auth/google
// @desc    Login or Register using Google account
// NOTE: requires frontend to send Google ID token after Google Sign-In popup
const googleAuth = async (req, res) => {
  try {
    const { googleId, email, firstName, lastName } = req.body;
    // In production, verify googleId token using google-auth-library here

    // Only include conditions for fields that are actually present.
    // { email: undefined } gets silently dropped from a Mongo query,
    // which would turn `$or: [{googleId}, {}]` into a match-everything
    // condition (an empty {} matches every document) — so findOne would
    // return an arbitrary, unrelated user instead of null.
    const dupConditions = [];
    if (googleId) dupConditions.push({ googleId });
    if (email) dupConditions.push({ email: email.toLowerCase() });
    let user = dupConditions.length ? await User.findOne({ $or: dupConditions }) : null;

    if (!user) {
      user = await User.create({ googleId, email, firstName, lastName });
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { register, login, getMe, googleAuth };
