const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Role = require('./models/Role');
require('dotenv').config();

const seedTestUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Make sure basic roles exist
    let studentRole = await Role.findOne({ name: 'Student' });
    if (!studentRole) studentRole = await Role.create({ name: 'Student', description: 'Platform student', permissions: [] });
    
    let teacherRole = await Role.findOne({ name: 'Teacher' });
    if (!teacherRole) teacherRole = await Role.create({ name: 'Teacher', description: 'Course instructor', permissions: [] });

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create Premium Student
    const premiumExists = await User.findOne({ email: 'premium@becs.com' });
    if (!premiumExists) {
      await User.create({
        name: 'Premium Student',
        email: 'premium@becs.com',
        password: hashedPassword,
        role: studentRole._id,
        legacyRole: 'student',
        isPremium: true,
        enrolledCourses: ['1', '2', '3'],
        gender: 'Male',
        country: 'India'
      });
      console.log('✅ Premium account created: premium@becs.com / password123');
    } else {
      console.log('⚠️ Premium account already exists: premium@becs.com');
    }

    // Create Student
    const studentExists = await User.findOne({ email: 'student@becs.com' });
    if (!studentExists) {
      await User.create({
        name: 'Demo Student',
        email: 'student@becs.com',
        password: hashedPassword,
        role: studentRole._id,
        legacyRole: 'student',
        enrolledCourses: ['1', '2'], // Mock IDs based on DEFAULT_COURSES
        gender: 'Male',
        country: 'India'
      });
      console.log('✅ Student account created: student@becs.com / password123');
    } else {
      console.log('⚠️ Student account already exists: student@becs.com');
    }

    // Create Teacher
    const teacherExists = await User.findOne({ email: 'teacher@becs.com' });
    if (!teacherExists) {
      await User.create({
        name: 'Demo Teacher',
        email: 'teacher@becs.com',
        password: hashedPassword,
        role: teacherRole._id,
        legacyRole: 'teacher',
        gender: 'Female',
        country: 'India'
      });
      console.log('✅ Teacher account created: teacher@becs.com / password123');
    } else {
      console.log('⚠️ Teacher account already exists: teacher@becs.com');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding test users:', error);
    process.exit(1);
  }
};

seedTestUsers();
