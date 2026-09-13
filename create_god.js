require('dotenv').config({ path: 'server/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const User = require('./server/models/User');

  let god = await User.findOne({ email: 'god@eduverse.com' });
  if (!god) {
    const password = await bcrypt.hash('god123', 10);
    god = new User({
      name: 'God User',
      email: 'god@eduverse.com',
      password: password,
      role: null,
      legacyRole: 'god',
      isAdmin: true,
      isPremium: true
    });
    await god.save();
    console.log('Created god user');
  } else {
    god.legacyRole = 'god';
    god.isAdmin = true;
    god.isPremium = true;
    await god.save();
    console.log('Updated god user');
  }
  process.exit(0);
}
run().catch(console.error);
