const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const coupons = mongoose.connection.collection('coupons');
  
  await coupons.updateOne(
    { code: 'PHELADABBA' },
    {
      $set: {
        code: 'PHELADABBA',
        discountPercent: 10,
        isActive: true,
        isFirstOrderOnly: true,
        minOrderValue: 0,
        expiryDate: new Date('2030-12-31T23:59:59.000Z'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    },
    { upsert: true }
  );
  console.log('Successfully seeded PHELADABBA coupon!');
  mongoose.disconnect();
});
