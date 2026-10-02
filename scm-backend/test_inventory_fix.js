const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config({ path: './.env' });

async function verifyInventoryUpdate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // 1. Get the current product to see before state
    const product = await Product.findOne({});
    if (!product) {
      console.error('No product found');
      process.exit(1);
    }
    
    const targetVariant = product.variants.find(v => v.weight === '250g');
    const beforeStock = targetVariant.stock;
    console.log(`Before stock for 250g: ${beforeStock}`);

    // 2. Perform the exact query we use in the backend
    const quantity = 2;
    const updateResult = await Product.updateOne(
      {
        _id: product._id,
        variants: {
          $elemMatch: {
            weight: '250g',
            stock: { $gte: quantity }
          }
        }
      },
      {
        $inc: { 'variants.$.stock': -quantity, totalSold: quantity }
      }
    );

    console.log(`Update result:`, updateResult);
    
    // 3. Verify after state
    const updatedProduct = await Product.findOne({ _id: product._id });
    const afterVariant = updatedProduct.variants.find(v => v.weight === '250g');
    console.log(`After stock for 250g: ${afterVariant.stock}`);
    
    if (updateResult.modifiedCount === 1 && afterVariant.stock === beforeStock - quantity) {
      console.log('SUCCESS: $elemMatch fixes the decrement bug and targets the correct variant.');
      
      // Reset the stock back to original
      await Product.updateOne(
        { _id: product._id, variants: { $elemMatch: { weight: '250g' } } },
        { $inc: { 'variants.$.stock': quantity, totalSold: -quantity } }
      );
      console.log('Restored stock for cleanliness.');
      
    } else {
      console.error('FAILED: Update did not work as expected.');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

verifyInventoryUpdate();
