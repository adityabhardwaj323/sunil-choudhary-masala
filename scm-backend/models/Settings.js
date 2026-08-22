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
  freeShippingAbove:  { type: Number, default: 499 }, // Legacy field, consider removing later
  shippingCharge:     { type: Number, default: 60 },  // Legacy field, consider removing later
  deliveryRanges: {
    type: [
      {
        minOrderValue: { type: Number, required: true },
        maxOrderValue: { type: Number, default: null }, // null means infinity
        charge: { type: Number, required: true },
        enabled: { type: Boolean, default: true }
      }
    ],
    default: [
      { minOrderValue: 0, maxOrderValue: 499, charge: 49, enabled: true },
      { minOrderValue: 500, maxOrderValue: null, charge: 0, enabled: true }
    ]
  },
  codCharge:          { type: Number, default: 29 },
  deliveryDays:       { type: String, default: '3-7 business days' },
  razorpayKeyId:      { type: String, default: '' },
  upiEnabled:         { type: Boolean, default: true },
  cardEnabled:        { type: Boolean, default: true },
  netBankingEnabled:  { type: Boolean, default: true },
  codEnabled:         { type: Boolean, default: true },
  updatedAt:          { type: Date, default: Date.now }
});

module.exports = mongoose.model('Settings', settingsSchema);
