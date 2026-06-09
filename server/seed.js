const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const Course = require('./models/Course');
const Enquiry = require('./models/Enquiry');
const Contact = require('./models/Contact');
const bcrypt = require('bcryptjs');

dotenv.config();

const products = [
  { name: 'Smart Switch Kit', badge: 'New', category: 'Smart Automation', price: 5500, originalPrice: 6200, rating: 4.9, reviews: 48, stock: 50, delivery: 'Delivery by Tomorrow', description: 'WiFi-enabled modular control kit for premium homes and offices.', specs: ['WiFi + App Control', 'Voice Assistant Ready', 'Modular Installation'], image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc0d4?auto=format&fit=crop&w=900&q=80' },
  { name: 'Automation Controller', badge: 'Bestseller', category: 'Industrial Control', price: 9800, originalPrice: 11200, rating: 4.8, reviews: 92, stock: 30, delivery: 'Delivery in 2 Days', description: 'Multi-channel industrial controller built for uptime and safe automation.', specs: ['8 Output Channels', 'Panel Mount Ready', 'Industrial Safety Rated'], image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=900&q=80' },
  { name: 'Security Camera Set', badge: 'Featured', category: 'Security Systems', price: 12500, originalPrice: 13900, rating: 4.7, reviews: 67, stock: 15, delivery: 'Delivery in 3 Days', description: '4K surveillance bundle with night vision and remote monitoring.', specs: ['4K Vision', 'Night Monitoring', 'Remote Mobile Access'], image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=900&q=80' },
  { name: 'IoT Starter Kit', badge: 'Popular', category: 'IoT Kits', price: 4200, originalPrice: 4800, rating: 4.9, reviews: 134, stock: 100, delivery: 'Delivery by Tomorrow', description: 'Sensor-rich learning and prototyping kit for IoT deployments.', specs: ['30+ Components', 'Quick Start Guide', 'Beginner Friendly'], image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80' },
  { name: 'Circuit Tools Kit', badge: 'Pro', category: 'Industrial Control', price: 6800, originalPrice: 7600, rating: 4.6, reviews: 55, stock: 40, delivery: 'Delivery in 2 Days', description: 'A professional toolkit for diagnostics, prototyping, and field support.', specs: ['25 Tools', 'Bench Ready', 'Field Use Compatible'], image: 'https://images.unsplash.com/photo-1563770660941-10a636076f6d?auto=format&fit=crop&w=900&q=80' },
  { name: 'Power Backup Module', badge: 'In Stock', category: 'Power Backup', price: 15000, originalPrice: 16800, rating: 4.8, reviews: 81, stock: 20, delivery: 'Delivery in 4 Days', description: 'Automatic switchover backup module for critical electronics loads.', specs: ['2000VA Support', 'Auto Switchover', 'Critical Load Safe'], image: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&w=900&q=80' },
  { name: 'PCB Design Console', badge: 'Premium', category: 'Lab Equipment', price: 18500, originalPrice: 20900, rating: 4.9, reviews: 24, stock: 10, delivery: 'Ships in 5 Days', description: 'Bench-ready design and testing console for advanced engineering teams.', specs: ['Bench Console', 'Testing Ports', 'Designer Workflow Ready'], image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80' },
  { name: 'Embedded Dev Board', badge: 'Fast Moving', category: 'IoT Kits', price: 7400, originalPrice: 8300, rating: 4.8, reviews: 39, stock: 60, delivery: 'Delivery in 2 Days', description: 'Compact development board for embedded firmware and edge computing.', specs: ['Edge AI Ready', 'GPIO + USB-C', 'Developer Friendly'], image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80' },
];

const courses = [
  { title: 'Foundation Batch (Class 8-10)', target: 'Class 8-10 Students', duration: '12 Months', mode: 'Offline', center: 'BECS HQ Kolkata', price: '₹15,000/year', originalPrice: '₹18,000', discount: '17% OFF', description: 'Build strong fundamentals in Science and Mathematics.', schedule: 'Mon-Fri, 4:00 PM - 6:00 PM', faculty: 'Mr. Banerjee, Mrs. Das' },
  { title: 'JEE / NEET Preparation (Class 11-12)', target: 'Class 11-12 Students', duration: '24 Months', mode: 'Offline', center: 'BECS HQ Kolkata', price: '₹45,000/year', originalPrice: '₹55,000', discount: '18% OFF', description: 'Comprehensive coaching for IIT-JEE and NEET entrance exams.', schedule: 'Mon-Sat, 6:00 AM - 9:00 AM', faculty: 'IIT Alumni Faculty Panel' },
  { title: 'GATE / IES Engineering Prep', target: 'B.Tech / B.E. Graduates', duration: '12 Months', mode: 'Offline + Online', center: 'BECS HQ Kolkata', price: '₹35,000/year', originalPrice: '₹42,000', discount: '17% OFF', description: 'Targeted preparation for GATE, IES, and PSU exams.', schedule: 'Weekdays, 10:00 AM - 1:00 PM', faculty: 'Prof. Mukherjee, Dr. Sen' },
  { title: 'Govt. Job Exam Preparation', target: 'SSC / Railway / Banking Aspirants', duration: '6 Months', mode: 'Offline', center: 'BECS HQ Kolkata', price: '₹12,000', originalPrice: '₹15,000', discount: '20% OFF', description: 'Complete preparation for SSC CGL, CHSL, Railway and Banking exams.', schedule: 'Mon-Sat, 2:00 PM - 5:00 PM', faculty: 'Competitive Exam Faculty' },
  { title: 'Core Electronics & IoT Engineering', target: 'Engineering Students & Professionals', duration: '6 Months', mode: 'Offline + Lab', center: 'BECS HQ Kolkata', price: '₹25,000', originalPrice: '₹30,000', discount: '17% OFF', description: 'Hands-on training in embedded systems, IoT, and PCB design.', schedule: 'Weekends, 10:00 AM - 4:00 PM', faculty: 'Mr. Banerjee, Industry Experts' },
  { title: 'Placement Preparation Program', target: 'Final Year Students & Freshers', duration: '3 Months', mode: 'Offline', center: 'BECS HQ Kolkata', price: '₹8,000', originalPrice: '₹10,000', discount: '20% OFF', description: 'Interview prep, aptitude training, and resume building.', schedule: 'Flexible Batches', faculty: 'HR Professionals & Alumni' },
];

const enquiries = [
  { name: 'Aarav Sharma', phone: '9876543210', courseName: 'JEE / NEET Preparation', type: 'Enrollment', status: 'Pending' },
  { name: 'Priya Das', phone: '9123456789', courseName: 'Foundation Batch (Class 8-10)', type: 'Brochure', status: 'Pending' },
  { name: 'Rohit Mukherjee', phone: '9988776655', courseName: 'GATE / IES Engineering Prep', type: 'StudyMaterial', status: 'Pending' },
  { name: 'Sneha Ghosh', phone: '8877665544', courseName: 'Core Electronics & IoT Engineering', type: 'Enrollment', status: 'Pending' },
];

const contacts = [
  { name: 'Rajesh Kumar', email: 'rajesh@example.com', subject: 'IoT Consulting', message: 'I am interested in your IoT consulting services for our factory automation project.' },
  { name: 'Meera Patel', email: 'meera@techcorp.com', subject: 'Bulk Order Enquiry', message: 'We need 50 units of the Automation Controller. Please share bulk pricing.' },
  { name: 'Anil Verma', email: 'anil.verma@gmail.com', subject: 'Partnership Opportunity', message: 'I run an electronics institute in Delhi and would like to discuss a partnership with BECS.' },
];

const seedData = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb+srv://Becs2k26:Becs2k26@cluster0.hap0jpp.mongodb.net/?appName=Cluster0';
    console.log(`Connecting to MongoDB at: ${mongoURI.split('@')[1] || 'Cluster'}...`);
    
    await mongoose.connect(mongoURI);

    // Clear all collections
    await Product.deleteMany();
    await User.deleteMany();
    await Course.deleteMany();
    await Enquiry.deleteMany();
    await Contact.deleteMany();

    // Seed all data
    await Product.insertMany(products);
    await Course.insertMany(courses);
    await Enquiry.insertMany(enquiries);
    await Contact.insertMany(contacts);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await User.create({
      name: 'Admin User',
      email: 'admin@becs.com',
      password: hashedPassword,
      isAdmin: true,
    });

    console.log('Data Seeded Successfully');
    console.log(`  - ${products.length} Products`);
    console.log(`  - ${courses.length} Courses`);
    console.log(`  - ${enquiries.length} Enquiries`);
    console.log(`  - ${contacts.length} Contacts`);
    console.log(`  - 1 Admin User (admin@becs.com / admin123)`);
    process.exit();
  } catch (error) {
    console.error('Error seeding data', error);
    process.exit(1);
  }
};

seedData();
