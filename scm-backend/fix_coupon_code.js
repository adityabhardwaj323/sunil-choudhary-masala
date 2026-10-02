const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Coupon = require('./models/Coupon');

dotenv.config({ path: './.env' });

async function fixCouponCode() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const updateResult = await Coupon.updateMany(
      { code: 'PHELADABBA' },
      { $set: { code: 'PEHLADABBA' } }
    );
    
    console.log(`Updated ${updateResult.modifiedCount} coupons to PEHLADABBA`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

fixCouponCode();
