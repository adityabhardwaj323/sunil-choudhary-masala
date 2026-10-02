const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const { updateCartItem } = require('./controllers/cartController');

async function run() {
  await mongoose.connect('mongodb://localhost:27017/scm');
  
  const product = await Product.findOne({ isActive: true });
  const user = await User.findOne({});
  const variant = product.variants[0];

  await Cart.deleteMany({ user: user._id });
  const cart = await Cart.create({
    user: user._id,
    items: [{ product: product._id, weight: variant.weight, price: variant.price, quantity: 1 }]
  });

  const item = cart.items[0];

  const tests = [-50, 0, 1, 1.5, 2];
  for (const qty of tests) {
    let req = {
      user: user,
      params: { itemId: item._id },
      body: { quantity: qty }
    };
    
    let res = {
      status: function(c) { return { json: function(d) { console.log(`[Qty: ${qty}] Status: ${c}, Msg: ${d.message}`); return this; } }; },
      json: function(d) { console.log(`[Qty: ${qty}] Success! Quantity set to: ${d.items[0].quantity}`); }
    };
    
    try {
      await updateCartItem(req, res);
    } catch (e) {
      console.log(`[Qty: ${qty}] Exception:`, e.message);
    }
  }

  process.exit(0);
}
run();
