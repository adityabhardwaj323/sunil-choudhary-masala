const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function seedAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  let admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    admin = await User.create({ name: 'Admin', email: 'admin@example.com', password: 'password', role: 'admin' });
  }
  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  console.log('ADMIN_TOKEN:', token);
  process.exit(0);
}
seedAdmin();
