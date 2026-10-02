const mongoose = require('mongoose');

const paymentFailureLogSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '30d' // automatically delete after 30 days
  }
});

module.exports = mongoose.model('PaymentFailureLog', paymentFailureLogSchema);
