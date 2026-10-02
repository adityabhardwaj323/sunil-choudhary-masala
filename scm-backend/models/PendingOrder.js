// models/PendingOrder.js
const mongoose = require('mongoose');

const PendingOrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  razorpayOrderId: { type: String, required: true, unique: true },
  cartSnapshot: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    variant: { type: String }
  }],
  shippingAddress: { type: Object, required: true },
  couponCode: { type: String },
  needsReconciliation: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PendingOrder', PendingOrderSchema);
