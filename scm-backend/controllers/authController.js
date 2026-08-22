// controllers/authController.js
// Handles: Register, Login, Get logged-in user profile

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
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

    // Send Welcome Email
    if (user.email) {
      try {
        const { welcomeEmail } = require('../utils/emailTemplates');
        const sendEmail = require('../utils/sendEmail');
        await sendEmail({
          email: user.email,
          subject: 'Welcome to Sunil Choudhary Masala!',
          message: `Welcome to SCM, ${user.firstName}!`,
          html: welcomeEmail(user.firstName)
        });
      } catch (err) {
        console.error('Failed to send welcome email:', err.message);
      }
    }

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

// @route   PUT /api/auth/profile
// @desc    Update user profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Check email/phone uniqueness if provided
      if (req.body.email && req.body.email !== user.email) {
        const emailExists = await User.findOne({ email: req.body.email.toLowerCase() });
        if (emailExists) {
          return res.status(400).json({ message: 'Email is already in use' });
        }
      }
      if (req.body.phone && req.body.phone !== user.phone) {
        const phoneExists = await User.findOne({ phone: req.body.phone });
        if (phoneExists) {
          return res.status(400).json({ message: 'Phone number is already in use' });
        }
      }

      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName !== undefined ? req.body.lastName : user.lastName;
      if (req.body.email !== undefined) user.email = req.body.email.toLowerCase();
      if (req.body.phone !== undefined) user.phone = req.body.phone;
      
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const sendEmail = require('../utils/sendEmail');

// @route   POST /api/auth/forgot-password
// @desc    Request OTP for password reset
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Please provide an email' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    
    // Always return generic response to prevent email enumeration
    const successMsg = 'If an account with that email exists, a password reset OTP has been sent.';

    if (!user) {
      return res.status(200).json({ message: successMsg });
    }

    // Enforce 60-second cooldown
    if (user.passwordResetOtpLastSentAt && (Date.now() - user.passwordResetOtpLastSentAt.getTime()) < 60000) {
      // Don't fail the generic response, just return it silently to avoid enumeration
      return res.status(200).json({ message: successMsg });
    }

    // Generate OTP
    const otp = user.generatePasswordResetOtp();
    await user.save({ validateBeforeSave: false });

    // Send email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your Password Reset OTP',
        message: `Your password reset OTP is: ${otp}\n\nIt expires in 10 minutes.`,
        html: `<p>Your password reset OTP is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`
      });
    } catch (emailError) {
      // If email fails, don't expose it to the user, just log in production
      // Reset the OTP fields so they can try again
      user.passwordResetOtpHash = undefined;
      user.passwordResetOtpExpires = undefined;
      user.passwordResetOtpAttempts = undefined;
      user.passwordResetOtpLastSentAt = undefined;
      await user.save({ validateBeforeSave: false });
    }

    res.status(200).json({ message: successMsg });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   POST /api/auth/resend-reset-otp
// @desc    Resend password reset OTP
const resendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Please provide an email' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    const successMsg = 'If an account with that email exists, a password reset OTP has been sent.';

    if (!user) {
      return res.status(200).json({ message: successMsg });
    }

    // Enforce 60-second cooldown
    if (user.passwordResetOtpLastSentAt && (Date.now() - user.passwordResetOtpLastSentAt.getTime()) < 60000) {
      return res.status(429).json({ message: 'Please wait 60 seconds before requesting another OTP.' });
    }

    // Generate new OTP (invalidates old one)
    const otp = user.generatePasswordResetOtp();
    await user.save({ validateBeforeSave: false });

    // Send email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your New Password Reset OTP',
        message: `Your new password reset OTP is: ${otp}\n\nIt expires in 10 minutes.`,
        html: `<p>Your new password reset OTP is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`
      });
    } catch (emailError) {
      user.passwordResetOtpHash = undefined;
      user.passwordResetOtpExpires = undefined;
      user.passwordResetOtpAttempts = undefined;
      user.passwordResetOtpLastSentAt = undefined;
      await user.save({ validateBeforeSave: false });
    }

    res.status(200).json({ message: successMsg });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP for password reset
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    
    // Generic response if no user to prevent enumeration (simulate invalid OTP)
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Check if OTP was requested and not expired
    if (!user.passwordResetOtpHash || !user.passwordResetOtpExpires || user.passwordResetOtpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Check attempts limit (max 5)
    if (user.passwordResetOtpAttempts >= 5) {
      // Invalidate OTP
      user.passwordResetOtpHash = undefined;
      user.passwordResetOtpExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(403).json({ message: 'Too many failed attempts. Please request a new OTP.' });
    }

    // Verify OTP hash
    const submittedOtpHash = crypto.createHash('sha256').update(otp).digest('hex');
    if (submittedOtpHash !== user.passwordResetOtpHash) {
      user.passwordResetOtpAttempts += 1;
      await user.save({ validateBeforeSave: false });
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP is valid!
    // Invalidate OTP, mark verified, and generate Auth Token
    user.passwordResetOtpHash = undefined;
    user.passwordResetOtpExpires = undefined;
    user.passwordResetOtpAttempts = undefined;
    user.passwordResetVerifiedAt = Date.now();
    
    const resetToken = user.generatePasswordResetAuthToken();
    await user.save({ validateBeforeSave: false });

    // Return the reset token to be used in the next step
    res.status(200).json({ 
      message: 'OTP verified successfully',
      resetToken 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   POST /api/auth/reset-password
// @desc    Reset password using Auth Token
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    // Get hashed token
    const passwordResetAuthTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await User.findOne({
      passwordResetAuthTokenHash,
      passwordResetAuthTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Set new password
    user.password = newPassword;
    
    // Clear all reset fields to ensure single-use
    user.passwordResetOtpHash = undefined;
    user.passwordResetOtpExpires = undefined;
    user.passwordResetOtpAttempts = undefined;
    user.passwordResetOtpLastSentAt = undefined;
    user.passwordResetVerifiedAt = undefined;
    user.passwordResetAuthTokenHash = undefined;
    user.passwordResetAuthTokenExpires = undefined;
    
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { register, login, getMe, googleAuth, updateProfile, forgotPassword, resendResetOtp, verifyOtp, resetPassword };
