const mongoose = require('mongoose');
const Coupon = require('./models/Coupon');

async function checkAndFixCoupon() {
  await mongoose.connect('mongodb://localhost:27017/scm');
  
  const coupon = await Coupon.findOne({ code: 'PEHLADABBA' });
  if (coupon) {
    console.log('Found coupon:', coupon);
  } else {
    console.log('Coupon not found.');
  }
  
  process.exit(0);
}
checkAndFixCoupon();
