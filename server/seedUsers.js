const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');
const Subscription = require('./models/Subscription');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const seed = async () => {
  await connectDB();

  try {
    // 1. Create a dummy course if none exist
    let course = await Course.findOne({ title: "Government Exam Preparation" });
    if (!course) {
      course = new Course({
        title: "Government Exam Preparation",
        target: "Job Seekers",
        duration: "6 Months",
        price: 4999,
        category: "Government Exams",
        status: "published"
      });
      await course.save();
      console.log('Created Government Exam Preparation course.');
    } else {
      console.log(`Found course: ${course.title}`);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // 2. Free Student Account (Enrolled, no course subscription)
    const freeStudentEmail = 'free@eduverse.com';
    let freeStudent = await User.findOne({ email: freeStudentEmail });
    if (freeStudent) await User.deleteOne({ email: freeStudentEmail });

    freeStudent = new User({
      name: 'Free Student',
      email: freeStudentEmail,
      password: hashedPassword,
      phone: '9999999991',
      legacyRole: 'student',
      enrollmentStatus: 'ENROLLED',
      profileCompleted: true,
      highestEducation: '12th',
      preparingFor: 'Government Exam Preparation',
      address: 'Test Address',
      city: 'Bardhaman',
      state: 'West Bengal',
      pinCode: '713104',
      isPremium: false
    });
    await freeStudent.save();

    // Create Enrollment (Base access)
    await Enrollment.deleteMany({ user: freeStudent._id });
    const freeEnrollment = new Enrollment({
      user: freeStudent._id,
      course: course._id,
      status: 'active'
    });
    await freeEnrollment.save();
    console.log('Created Free Student.');

    // 3. Premium Student Account (Enrolled + Subscription)
    const premiumStudentEmail = 'premium@eduverse.com';
    let premiumStudent = await User.findOne({ email: premiumStudentEmail });
    if (premiumStudent) await User.deleteOne({ email: premiumStudentEmail });

    premiumStudent = new User({
      name: 'Premium Student',
      email: premiumStudentEmail,
      password: hashedPassword,
      phone: '9999999992',
      legacyRole: 'student',
      enrollmentStatus: 'ENROLLED',
      profileCompleted: true,
      highestEducation: '12th',
      preparingFor: 'Government Exam Preparation',
      address: 'Test Address',
      city: 'Bardhaman',
      state: 'West Bengal',
      pinCode: '713104',
      isPremium: true
    });
    await premiumStudent.save();

    // Create Enrollment (Base access)
    await Enrollment.deleteMany({ user: premiumStudent._id });
    const premiumEnrollment = new Enrollment({
      user: premiumStudent._id,
      course: course._id,
      status: 'active'
    });
    await premiumEnrollment.save();

    // Create Subscription (Premium access)
    await Subscription.deleteMany({ user: premiumStudent._id });
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const premiumSubscription = new Subscription({
      user: premiumStudent._id,
      course: course._id,
      plan: new mongoose.Types.ObjectId(), // Dummy plan
      status: 'active',
      startDate: new Date(),
      endDate: nextMonth
    });
    await premiumSubscription.save();
    console.log('Created Premium Student.');

    console.log('\n--- CREDENTIALS ---');
    console.log('Free Student (State A - Enrolled, No Subscription):');
    console.log('Email: free@eduverse.com');
    console.log('Password: password123\n');
    console.log('Premium Student (State B - Active Subscription):');
    console.log('Email: premium@eduverse.com');
    console.log('Password: password123');
    console.log('-------------------\n');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    process.exit();
  }
};

seed();
