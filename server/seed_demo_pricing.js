require('dotenv').config();
const mongoose = require('mongoose');
const SystemConfig = require('./models/SystemConfig');
const Course = require('./models/Course');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // 1. Update Subscription Pricing to 1 Rupee
    const config = await SystemConfig.findOneAndUpdate(
      { key: 'SUBSCRIPTION_PRICING' },
      { 
        value: { originalPrice: 1, discountedPrice: 1 },
        description: 'Global monthly subscription pricing for EduVerse Premium.'
      },
      { new: true, upsert: true }
    );
    console.log('Subscription pricing updated to 1 Rupee:', config.value);

    // 2. Create or Update Demo Course
    const demoCourse = await Course.findOneAndUpdate(
      { title: 'Demo Course (1 Rupee)' },
      {
        title: 'Demo Course (1 Rupee)',
        target: 'All Students',
        duration: '1 Month',
        mode: 'Online',
        price: 1,
        originalPrice: 10,
        discount: '90% OFF',
        description: 'This is a demo course created for testing the payment and enrollment flow.',
        category: 'Demo',
        level: 'All Levels',
        status: 'published'
      },
      { new: true, upsert: true }
    );
    console.log('Demo Course created/updated with 1 Rupee price:', demoCourse.title);

    console.log('Demo seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seedData();
