const mongoose = require('mongoose');
const Coupon = require('./models/Coupon');

async function createCoupon() {
  await mongoose.connect('mongodb://localhost:27017/scm');
  
  const coupon = await Coupon.create({
    code: 'PHELADABBA',
    discountPercent: 10,
    isActive: true,
    isFirstOrderOnly: true,
    expiryDate: new Date('2030-12-31'),
    minOrderValue: 0
  });
  console.log('Created coupon:', coupon);
  
  process.exit(0);
}
createCoupon();
