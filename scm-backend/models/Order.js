// models/Order.js
// This defines what information we store about each order placed by a customer

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true // e.g. SCM-2025-00123
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String, // saved separately in case product is later deleted/changed
      weight: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  shippingAddress: {
    firstName: String,
    lastName: String,
    phone: String,
    alternatePhone: String,
    email: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String,
    addressType: String,
    latitude: Number,
    longitude: Number,
    accuracy: Number
  },
  paymentMethod: {
    type: String,
    enum: ['UPI', 'Card', 'NetBanking', 'COD'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  refundStatus: {
    type: String,
    enum: ['NotRequired', 'Processing', 'Refunded', 'Failed'],
    default: 'NotRequired'
  },
  razorpayRefundId: String,
  refundAmount: Number,
  refundInitiatedAt: Date,
  refundProcessedAt: Date,
  refundFailureReason: String,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,

  subtotal: Number,
  shippingCharge: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  couponCode: String,
  totalAmount: { type: Number, required: true },

  orderStatus: {
    type: String,
    enum: ['Processing', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Processing'
  },
  trackingNumber: String,

  // Timeline log — every status change gets recorded here automatically
  statusHistory: [
    {
      status: String,
      note: String,
      date: { type: Date, default: Date.now }
    }
  ],

  // Tracks which email events have been sent to prevent duplicates
  emailNotificationHistory: [{ type: String }],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
