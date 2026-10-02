const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');
require('dotenv').config();

async function runTest() {
  let session;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Seed
    await Category.deleteMany({ slug: 'chilli-powders' });
    await Product.deleteMany({ name: 'Test Product 1' });

    let cat = await Category.create({ name: 'Chilli Powders', slug: 'chilli-powders' });
    let prod = await Product.create({
      name: 'Test Product 1',
      description: 'Test',
      price: 10,
      stock: 10,
      category: 'Chilli Powders', // valid enum
      images: []
    });

    // Run failure test
    session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const category = await Category.findById(cat._id).session(session);
        category.name = 'Premium Chilli Powders';
        category.slug = 'premium-chilli-powders';
        await category.save({ session });
        
        await Product.updateMany(
          { category: 'Chilli Powders' },
          { $set: { category: 'Premium Chilli Powders' } },
          { session }
        );

        // artificially fail
        throw new Error('Simulated failure during Product update');
      });
    } catch (e) {
      console.log('Transaction failed as expected:', e.message);
    }
    
    // Verify rollback
    const verifyCat = await Category.findById(cat._id);
    if (verifyCat.name === 'Chilli Powders') {
      console.log('ROLLBACK SUCCESSFUL: Category name reverted');
    } else {
      console.log('ROLLBACK FAILED: Category name is', verifyCat.name);
    }

    const verifyProd = await Product.findById(prod._id);
    if (verifyProd.category === 'Chilli Powders') {
      console.log('ROLLBACK SUCCESSFUL: Product category reverted');
    } else {
      console.log('ROLLBACK FAILED: Product category is', verifyProd.category);
    }
    
    // Cleanup
    await Category.findByIdAndDelete(cat._id);
    await Product.findByIdAndDelete(prod._id);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

runTest();
