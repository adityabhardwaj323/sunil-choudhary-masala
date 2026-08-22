const fs = require('fs');
const path = 'controllers/cartController.js';
let content = fs.readFileSync(path, 'utf8');

// Replace addToCart logic to include stock checks
const newAddToCart = `const existingItem = cart.items.find(
      item => item.product.toString() === productId && item.weight === weight
    );

    const requestedQty = quantity || 1;
    const currentQty = existingItem ? existingItem.quantity : 0;
    const newTotalQty = currentQty + requestedQty;

    if (newTotalQty > variant.stock) {
      return res.status(400).json({ message: 'Insufficient stock available' });
    }

    if (existingItem) {
      existingItem.quantity = newTotalQty;
    } else {
      cart.items.push({ product: productId, weight, price: variant.price, quantity: requestedQty });
    }`;

content = content.replace(/const existingItem = cart\.items\.find\([\s\S]*?cart\.items\.push\(\{ product: productId, weight, price: variant\.price, quantity: quantity \|\| 1 \}\);\s*\}/, newAddToCart);

// Replace updateCartItem logic to include stock checks
const newUpdateCart = `const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    // Find the product and variant to check stock
    const Product = require('../models/Product');
    const product = await Product.findById(item.product);
    if (product) {
      const variant = product.variants.find(v => v.weight === item.weight);
      if (variant && quantity > variant.stock) {
        return res.status(400).json({ message: 'Insufficient stock available' });
      }
    }

    item.quantity = quantity;`;

content = content.replace(/const item = cart\.items\.id\(req\.params\.itemId\);\s*if \(\!item\) return res\.status\(404\)\.json\(\{ message: 'Item not found in cart' \}\);\s*item\.quantity = quantity;/, newUpdateCart);

fs.writeFileSync(path, content, 'utf8');
console.log('cartController updated with stock validation');
