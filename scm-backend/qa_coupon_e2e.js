const mongoose = require('mongoose');
const Coupon = require('./models/Coupon');
const Order = require('./models/Order');
const User = require('./models/User');
const { validateCoupon, createCoupon } = require('./controllers/couponController');
const { placeOrder } = require('./controllers/orderController');

async function runTests() {
  await mongoose.connect('mongodb://localhost:27017/scm');
  console.log('Connected to DB');
  
  // Clean up
  await Coupon.deleteMany({ code: { $regex: '^QA_' } });
  await Order.deleteMany({ 'shippingAddress.firstName': 'QA_TEST' });
  await User.deleteMany({ email: 'qa@test.com' });
  
  // Phase 1: Create Coupon via controller
  let req = { body: { code: 'QA_PHELADABBA', discountPercent: 10, minOrderValue: 0, expiryDate: new Date('2030-12-31').toISOString(), isActive: true, isFirstOrderOnly: true } };
  let res = { status: (c) => ({ json: (d) => { console.log('Create Coupon Status:', c); }}) };
  await createCoupon(req, res);
  
  // Phase 3 & 5: Duplicate Coupon
  let reqDup = { body: { code: ' QA_PHELADABBA ' } };
  let resDup = { status: (c) => ({ json: (d) => { console.log('Duplicate Create Status:', c, d.message); }}) };
  await createCoupon(reqDup, resDup);

  // Phase 9: First-Order Eligibility
  const user = await User.create({ firstName: 'QA', lastName: 'User', email: 'qa@test.com', phone: '1234567890', password: 'password123' });
  
  // Mock req/res for validateCoupon
  let reqValid = { user: user, body: { code: ' qa_pheladabba ', orderValue: 1000 } };
  let resValid = { status: (c) => ({ json: (d) => { console.log('Validate Status:', c, d); } }), json: (d) => { console.log('Validate Success:', d); } };
  await validateCoupon(reqValid, resValid);
  
  // Create a cancelled order
  await Order.create({ user: user._id, orderStatus: 'Cancelled', paymentStatus: 'Pending', totalAmount: 1000, shippingAddress: { firstName: 'QA_TEST' } });
  
  // Should still be valid since order was cancelled
  await validateCoupon(reqValid, resValid);

  // Create a successful order
  await Order.create({ user: user._id, orderStatus: 'Delivered', paymentStatus: 'Paid', totalAmount: 1000, shippingAddress: { firstName: 'QA_TEST' } });

  // Should fail now
  let resValid2 = { status: (c) => ({ json: (d) => { console.log('Validate After Success Status:', c, d.message); } }) };
  await validateCoupon(reqValid, resValid2);
  
  console.log('Done');
  process.exit(0);
}

runTests();
