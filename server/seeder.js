const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');

dotenv.config();

const DEFAULT_COURSES = [
  {
    title: 'Government Exam Preparation',
    target: 'SSC, Railway, Banking, WBCS, WBPSC, Police, Defence, TET, CTET',
    duration: '12 Months',
    mode: 'Online / Offline',
    center: 'All Centers',
    price: 999,
    originalPrice: 1999,
    discount: '50% OFF',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    description: 'Complete syllabus coverage with live mentorship, job assistance, and performance analytics.',
    schedule: 'Daily Classes',
    facultyName: 'Expert Government Officers',
    syllabus: [
      'Complete syllabus coverage',
      'Weekly & Monthly mock tests',
      'Previous Year Questions (PYQ)',
      'Daily practice questions',
      'Current affairs',
      'Live mentorship',
      'Career roadmap',
      'Interview preparation',
      'Job assistance',
      'Doubt clearing',
      'Performance analytics',
      'Recorded lectures',
      'Downloadable notes'
    ],
    badge: 'BESTSELLER',
    rating: 4.9,
    studentCount: 15200,
    language: 'English, Hindi, Bengali',
    certificate: true,
    emi: false,
    seatsLeft: 12,
    startsIn: '2 Days'
  },
  {
    title: 'Joint Entrance Preparation',
    target: 'JEE Main, Advanced, NEET, WBJEE',
    duration: '24 Months',
    mode: 'Online / Offline',
    center: 'All Centers',
    price: 999,
    originalPrice: 1999,
    discount: '50% OFF',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    description: 'Comprehensive entrance coaching including admission assistance, college counselling, and mock tests.',
    schedule: 'Weekend Batches',
    facultyName: 'IIT/NIT Alumni & Doctors',
    syllabus: [
      'Admission Assistance',
      'Entrance Coaching',
      'College Counselling',
      'Weekly Mock Tests',
      'Monthly Mock Tests',
      'PYQ Solutions',
      'Study Materials',
      'Live Mentorship',
      'Doubts Solving',
      'Practice Questions',
      'Progress Analytics',
      'Recorded Classes'
    ],
    badge: 'POPULAR',
    rating: 4.8,
    studentCount: 10500,
    language: 'English, Bengali',
    certificate: true,
    emi: false,
    seatsLeft: 25,
    startsIn: 'Next Week'
  },
  {
    title: 'Board Exam Preparation (Secondary)',
    target: 'Class 10 (CBSE, ICSE, State Boards)',
    duration: 'Entire Session',
    mode: 'Online / Offline',
    center: 'All Centers',
    price: 999,
    originalPrice: 1999,
    discount: '50% OFF',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80',
    description: 'Complete class 10 preparation covering all subjects with notes, PYQ, and exam suggestions.',
    schedule: 'Evening Batches',
    facultyName: 'Top Subject Experts',
    syllabus: [
      'Complete syllabus',
      'All subjects',
      'Chapter wise notes',
      'PYQ',
      'Numericals',
      'Question solving',
      'Exam suggestions',
      'Mock tests',
      'Revision tests',
      'Mentor support'
    ],
    badge: 'ESSENTIAL',
    rating: 4.7,
    studentCount: 8100,
    language: 'English, Bengali, Hindi',
    certificate: true,
    emi: false,
    seatsLeft: 8,
    startsIn: 'Tomorrow'
  },
  {
    title: 'Board Exam Preparation (Higher Secondary)',
    target: 'Class 11-12 (Science / Commerce / Arts)',
    duration: 'Entire Session',
    mode: 'Online / Offline',
    center: 'All Centers',
    price: 999,
    originalPrice: 1999,
    discount: '50% OFF',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    description: 'Specialized preparation for class 11-12 across all streams with live doubt sessions and mentor guidance.',
    schedule: 'Regular Evening Batches',
    facultyName: 'Experienced Examiners',
    syllabus: [
      'Complete syllabus',
      'Science / Commerce / Arts',
      'PYQ',
      'Numericals',
      'Mock tests',
      'Revision papers',
      'Exam suggestions',
      'Live doubt sessions',
      'Recorded lectures',
      'Mentor guidance'
    ],
    badge: 'NEW',
    rating: 4.9,
    studentCount: 12000,
    language: 'English, Hindi, Bengali',
    certificate: true,
    emi: false,
    seatsLeft: 15,
    startsIn: '3 Days'
  }
];

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb+srv://Becs2k26:Becs2k26@cluster0.hap0jpp.mongodb.net/?appName=Cluster0';
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected.');

    await Course.deleteMany();
    console.log('Cleared existing courses.');

    await Course.insertMany(DEFAULT_COURSES);
    console.log('Database successfully seeded with Premium Courses!');

    process.exit();
  } catch (error) {
    console.error('Error with data import', error);
    process.exit(1);
  }
};

seedDB();
