// models/User.js
// This defines what information we store about each user (customer or admin)

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true, // allows multiple users without email (phone-only login)
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  password: {
    type: String,
    minlength: 6,
    select: false // never return password in queries by default
  },
  googleId: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  addresses: [
    {
      label: { type: String, default: 'Home' },
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      pincode: String,
      phone: String,
      latitude: Number,
      longitude: Number,
      accuracy: Number,
      isDefault: { type: Boolean, default: false }
    }
  ],
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ],
  isBlocked: {
    type: Boolean,
    default: false
  },
  passwordResetOtpHash: String,
  passwordResetOtpExpires: Date,
  passwordResetOtpAttempts: {
    type: Number,
    default: 0
  },
  passwordResetOtpLastSentAt: Date,
  passwordResetVerifiedAt: Date,
  passwordResetAuthTokenHash: String,
  passwordResetAuthTokenExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Before saving a user, hash their password (never store plain text passwords)
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to check if entered password matches the hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash OTP
userSchema.methods.generatePasswordResetOtp = function () {
  // Generate 6 digit OTP (string to keep leading zeros)
  const otp = crypto.randomInt(100000, 1000000).toString().padStart(6, '0');

  // Hash OTP and set to passwordResetOtpHash field
  this.passwordResetOtpHash = crypto.createHash('sha256').update(otp).digest('hex');

  // Set expire (10 minutes)
  this.passwordResetOtpExpires = Date.now() + 10 * 60 * 1000;
  
  // Reset attempts
  this.passwordResetOtpAttempts = 0;
  
  // Set last sent
  this.passwordResetOtpLastSentAt = Date.now();

  return otp;
};

// Generate auth token after successful OTP
userSchema.methods.generatePasswordResetAuthToken = function () {
  // Generate secure token
  const authToken = crypto.randomBytes(32).toString('hex');
  
  // Hash token
  this.passwordResetAuthTokenHash = crypto.createHash('sha256').update(authToken).digest('hex');
  
  // Set short expire (e.g. 15 minutes to allow typing new password)
  this.passwordResetAuthTokenExpires = Date.now() + 15 * 60 * 1000;
  
  return authToken;
};

module.exports = mongoose.model('User', userSchema);
