const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const coupons = await mongoose.connection.collection('coupons').find({}).toArray();
  console.log('All Coupons in DB:', coupons);
  mongoose.disconnect();
});
