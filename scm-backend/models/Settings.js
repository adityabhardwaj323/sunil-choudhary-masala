// models/Settings.js
// Singleton document — only one settings record ever exists
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  shopName:           { type: String, default: 'Sunil Choudhary Masala' },
  ownerName:          { type: String, default: 'Sunil Choudhary' },
  phone:              { type: String, default: '' },
  email:              { type: String, default: '' },
  address:            { type: String, default: '' },
  whatsapp:           { type: String, default: '' },
  freeShippingAbove:  { type: Number, default: 499 },
  shippingCharge:     { type: Number, default: 60 },
  codCharge:          { type: Number, default: 50 },
  deliveryDays:       { type: String, default: '3-7 business days' },
  razorpayKeyId:      { type: String, default: '' },
  upiEnabled:         { type: Boolean, default: true },
  cardEnabled:        { type: Boolean, default: true },
  netBankingEnabled:  { type: Boolean, default: true },
  codEnabled:         { type: Boolean, default: true },
  updatedAt:          { type: Date, default: Date.now }
});

module.exports = mongoose.model('Settings', settingsSchema);
