const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Coupon = require('./models/Coupon');
const { registerUser, authUser } = require('./controllers/authController');
const { getProducts, getProductById } = require('./controllers/productController');
const { createPayment, placeOrder, razorpayWebhook } = require('./controllers/orderController');

async function run() {
  await mongoose.connect('mongodb://localhost:27017/scm');
  console.log('Connected to DB');
  
  // Clean up
  await User.deleteMany({ email: 'qa_e2e@test.com' });
  await Order.deleteMany({ 'shippingAddress.firstName': 'QA_E2E' });
  await Product.deleteMany({ name: 'QA Spice' });
  await Coupon.deleteMany({ code: 'QA_E2E_COUPON' });

  // 1. Setup Data
  const product = await Product.create({
    name: 'QA Spice',
    slug: 'qa-spice',
    description: 'Test spice',
    category: 'Spices',
    variants: [
      { weight: '100g', price: 100, stock: 10 },
      { weight: '500g', price: 400, stock: 5 }
    ],
    isActive: true,
    images: ['test.jpg']
  });

  await Coupon.create({
    code: 'QA_E2E_COUPON',
    discountPercent: 10,
    isActive: true,
    expiryDate: new Date('2030-12-31')
  });

  // 2. Register User
  let reqReg = { body: { firstName: 'QA', lastName: 'E2E', email: 'qa_e2e@test.com', phone: '1234567890', password: 'password' } };
  let resReg = { status: (c) => ({ json: (d) => { console.log('Reg Status:', c); return this; }}) };
  await registerUser(reqReg, resReg);
  
  const user = await User.findOne({ email: 'qa_e2e@test.com' });
  
  // 3. Price Manipulation & Razorpay Order Creation
  const cartItems = [{ product: product._id, weight: '100g', quantity: 2, price: 1 }]; // Fake price 1, actual 100, total = 200
  let reqCreate = {
    user: user,
    body: {
      items: cartItems,
      shippingAddress: { firstName: 'QA_E2E', lastName: 'User', address: '123', city: 'City', state: 'State', pincode: '123456', phone: '1234567890' },
      paymentMethod: 'Razorpay',
      couponCode: 'QA_E2E_COUPON',
      totalAmount: 1, // Malicious total
      shippingCharge: 0,
      discount: 999 // Malicious discount
    }
  };
  
  let razorpayOrderId = null;
  let resCreate = {
    status: (c) => ({ json: (d) => { console.log('Create Payment Error:', c, d); return this; }}),
    json: (d) => { 
      console.log('Create Payment Success. Order Amount (Paise):', d.amount); // Should be (200 - 10%) = 180 => 18000 paise
      razorpayOrderId = d.id;
    }
  };
  
  try {
    await createPayment(reqCreate, resCreate);
  } catch (e) {
    console.log('Create payment exception:', e.message);
  }
  
  // 4. Stock validation - Try to buy more than stock
  const cartItemsOOS = [{ product: product._id, weight: '100g', quantity: 20, price: 100 }];
  let reqCreateOOS = {
    user: user,
    body: {
      items: cartItemsOOS,
      shippingAddress: reqCreate.body.shippingAddress,
      paymentMethod: 'Razorpay'
    }
  };
  let resCreateOOS = {
    status: (c) => ({ json: (d) => { console.log('OOS Error:', c, d); return this; }})
  };
  await createPayment(reqCreateOOS, resCreateOOS);

  console.log('Done');
  process.exit(0);
}

run();
