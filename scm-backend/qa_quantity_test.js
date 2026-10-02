const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const { createPayment } = require('./controllers/orderController');

async function run() {
  await mongoose.connect('mongodb://localhost:27017/scm');
  
  const product = await Product.findOne({ isActive: true });
  const user = await User.findOne({});
  const variant = product.variants[0];

  const cartItems = [{ product: product._id, weight: variant.weight, quantity: -10, price: variant.price }];
  
  let req = {
    user: user,
    body: {
      items: cartItems,
      shippingAddress: { firstName: 'QA_E2E', lastName: 'User', address: '123', city: 'City', state: 'State', pincode: '123456', phone: '1234567890' },
      paymentMethod: 'Razorpay',
      totalAmount: 1, // Doesn't matter
      shippingCharge: 0,
      discount: 0
    }
  };
  
  let res = {
    status: function(c) { return { json: function(d) { console.log('Error:', c, d.error || d.message); return this; } }; },
    json: function(d) { console.log('Success:', d); }
  };
  
  await createPayment(req, res);
  process.exit(0);
}
run();
