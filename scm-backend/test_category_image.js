require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const runTest = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');

    console.log('--- TEST 1: Create Category ---');
    const name = 'Test Category ' + Date.now();
    const slug = 'test-category-' + Date.now();
    
    let category = await Category.create({ name, slug });
    console.log('Created category:', category._id, category.name);
    
    console.log('--- TEST 2: Update Category with Image ---');
    const base64 = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    const dataUri = `data:image/gif;base64,${base64}`;
    
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: 'scm/categories',
      resource_type: 'image'
    });
    console.log('Uploaded to Cloudinary:', uploadResult.public_id, uploadResult.secure_url);
    
    category.image = {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id
    };
    await category.save();
    console.log('Updated category in DB with image:', category.image);

    console.log('--- TEST 3: Remove Image ---');
    if (category.image && category.image.publicId) {
      console.log('Destroying from Cloudinary:', category.image.publicId);
      await cloudinary.uploader.destroy(category.image.publicId);
      category.image = { url: '', publicId: '' };
      await category.save();
      console.log('Image removed successfully.');
    }

    console.log('--- TEST 4: Cleanup ---');
    await Category.findByIdAndDelete(category._id);
    console.log('Test category deleted.');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected.');
  }
};

runTest();
