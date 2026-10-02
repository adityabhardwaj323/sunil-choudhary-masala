const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');
const { register } = require('./controllers/authController');
const { createPayment } = require('./controllers/orderController');

async function run() {
  await mongoose.connect('mongodb://localhost:27017/scm');
  console.log('Connected to DB');
  
  await User.deleteMany({ email: 'qa_e2e@test.com' });
  await Coupon.deleteMany({ code: 'QA_E2E_COUPON' });
  await Product.deleteMany({ name: 'QA Spice' });

  const product = await Product.create({
    name: 'QA Spice',
    slug: 'qa-spice',
    description: 'Test',
    category: 'Chilli Powders',
    isActive: true,
    variants: [
      { weight: '100g', price: 100, mrp: 120, stock: 10 }
    ],
    images: ['img1.jpg']
  });

  await Coupon.create({
    code: 'QA_E2E_COUPON',
    discountPercent: 10,
    isActive: true,
    expiryDate: new Date('2030-12-31')
  });

  // 2. Register User
  let reqReg = { body: { firstName: 'QA', lastName: 'E2E', email: 'qa_e2e@test.com', phone: '1234567890', password: 'password123' } };
  let resReg = { 
    status: function(c) { return { json: function(d) { console.log('Reg Status:', c); return this; } }; },
    cookie: function() {},
    json: function(d) { console.log('Reg success'); }
  };
  await register(reqReg, resReg);
  
  const user = await User.findOne({ email: 'qa_e2e@test.com' });
  
  const variant = product.variants[0];
  const actualPrice = variant.price;
  console.log('Actual DB Price:', actualPrice);

  // 3. Price Manipulation & Razorpay Order Creation
  const cartItems = [{ product: product._id, weight: variant.weight, quantity: 2, price: 1 }]; // Fake price 1
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
  
  let resCreate = {
    status: function(c) { return { json: function(d) { console.log('Create Payment Status:', c, d.error || d.message); return this; } }; },
    json: function(d) { 
      console.log('Create Payment Success. Order Amount (Paise):', d.amount); 
    }
  };
  
  try {
    await createPayment(reqCreate, resCreate);
  } catch (e) {
    console.log('Create payment exception:', e.message);
  }
  
  console.log('Done');
  process.exit(0);
}

run();
