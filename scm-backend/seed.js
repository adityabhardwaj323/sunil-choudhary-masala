// seed.js
// Run this ONCE with: node seed.js
// It creates an admin login + sample products so you have data to test with

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');

const seedData = async () => {
  await connectDB();

  // ── Create Admin Account ──
  const adminExists = await User.findOne({ email: 'admin@sunilchoudharymasala.com' });
  if (!adminExists) {
    await User.create({
      firstName: 'Sunil',
      lastName: 'Choudhary',
      email: 'admin@sunilchoudharymasala.com',
      password: 'admin123', // CHANGE THIS after first login!
      role: 'admin'
    });
    console.log('✅ Admin account created');
    console.log('   Email: admin@sunilchoudharymasala.com');
    console.log('   Password: admin123');
  } else {
    console.log('ℹ️  Admin account already exists');
  }

  // ── Create Sample Products ──
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany([
      {
        name: 'Laal Mirch Powder',
        description: 'Made from the finest Mathania chillies — stone-ground for maximum colour and flavour.',
        category: 'Red Chilli',
        images: [],
        variants: [
          { weight: '100g', price: 149, mrp: 180, stock: 100 },
          { weight: '250g', price: 349, mrp: 420, stock: 80 },
          { weight: '500g', price: 649, mrp: 780, stock: 50 }
        ],
        isFeatured: true,
        isBestseller: true,
        fssaiNumber: '12345678901234'
      },
      {
        name: 'Haldi Powder',
        description: 'Deep golden turmeric with high curcumin content. Certified natural.',
        category: 'Turmeric',
        images: [],
        variants: [
          { weight: '100g', price: 129, mrp: 160, stock: 100 },
          { weight: '250g', price: 299, mrp: 360, stock: 70 }
        ],
        isFeatured: true,
        fssaiNumber: '12345678901234'
      },
      {
        name: 'Dhaniya Powder',
        description: 'Freshly stone-ground coriander with a warm, citrusy aroma.',
        category: 'Coriander',
        images: [],
        variants: [
          { weight: '100g', price: 119, mrp: 145, stock: 90 }
        ],
        isNewArrival: true,
        fssaiNumber: '12345678901234'
      },
      {
        name: 'Rajasthani Garam Masala',
        description: 'A secret 12-spice blend perfected over three generations.',
        category: 'Spice Blends',
        images: [],
        variants: [
          { weight: '100g', price: 199, mrp: 240, stock: 60 }
        ],
        isFeatured: true,
        isBestseller: true,
        fssaiNumber: '12345678901234'
      }
    ]);
    console.log('✅ Sample products created (4 products)');
  } else {
    console.log('ℹ️  Products already exist, skipping');
  }

  console.log('\n🎉 Seed complete! You can now start the server with: npm run dev');
  mongoose.connection.close();
};

seedData();
