// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { register, login, getMe, googleAuth, updateProfile, forgotPassword, resendResetOtp, verifyOtp, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { message: 'Too many login attempts, please try again later.' } });
const registerLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: { message: 'Too many registration attempts, please try again later.' } });
const forgotPasswordLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 3, message: { message: 'Too many password reset requests, please try again later.' } });
const resendOtpLimiter = rateLimit({ windowMs: 60 * 1000, max: 1, message: { message: 'Please wait 60 seconds before requesting another OTP.' } });
const verifyOtpLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: { message: 'Too many failed OTP attempts, please try again later.' } });
const resetPasswordLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: { message: 'Too many password reset attempts, please try again later.' } });

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/google', loginLimiter, googleAuth);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/resend-reset-otp', resendOtpLimiter, resendResetOtp);
router.post('/verify-otp', verifyOtpLimiter, verifyOtp);
router.post('/reset-password', resetPasswordLimiter, resetPassword);

module.exports = router;
