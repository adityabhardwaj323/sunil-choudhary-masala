const mongoose = require('mongoose');
require('dotenv').config();

async function testTransaction() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected');
    const session = await mongoose.startSession();
    session.startTransaction();
    console.log('Transaction started');
    await session.abortTransaction();
    console.log('Transaction aborted');
    session.endSession();
    console.log('Session ended');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

testTransaction();
