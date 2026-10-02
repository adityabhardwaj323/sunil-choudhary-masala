const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');
require('dotenv').config();

async function runSuccessTest() {
  let session;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Seed
    await Category.deleteMany({ slug: 'chilli-powders' });
    await Category.deleteMany({ slug: 'premium-chilli-powders' });
    await Product.deleteMany({ name: 'Test Product Success' });

    let cat = await Category.create({ name: 'Chilli Powders', slug: 'chilli-powders' });
    let prod = await Product.create({
      name: 'Test Product Success',
      description: 'Test',
      price: 10,
      stock: 10,
      category: 'Chilli Powders', // valid enum previously
      images: []
    });

    console.log('Before Rename:', prod.category);

    // Run Success Rename
    session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const category = await Category.findById(cat._id).session(session);
      let oldName = category.name;
      category.name = 'Premium Chilli Powders';
      category.slug = 'premium-chilli-powders';
      await category.save({ session });
      
      await Product.updateMany(
        { category: oldName },
        { $set: { category: category.name } },
        { session }
      );
    });
    session.endSession();

    // Verify update
    const verifyCat = await Category.findById(cat._id);
    const verifyProd = await Product.findById(prod._id);
    
    console.log('After Rename Cat:', verifyCat.name);
    console.log('After Rename Prod:', verifyProd.category);

    if (verifyCat.name === 'Premium Chilli Powders' && verifyProd.category === 'Premium Chilli Powders') {
      console.log('SUCCESS TEST PASSED');
    } else {
      console.log('SUCCESS TEST FAILED');
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

runSuccessTest();
