require('dotenv').config({ path: 'server/.env' });
const mongoose = require('mongoose');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  const User = require('./server/models/User');
  const Subscription = require('./server/models/Subscription');

  const user = await User.findOne({ email: 'premium@eduverse.com' });
  if (!user) {
    console.log('User not found');
    process.exit(1);
  }

  const sub = new Subscription({
    user: user._id,
    planType: 'Government Examination',
    amount: 4999,
    status: 'active',
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });

  await sub.save();
  console.log('Subscription created successfully');
  
  user.isPremium = true;
  await user.save();
  console.log('User marked as premium');

  process.exit(0);
}

run().catch(console.error);
