const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  
  // EduVerse Specific Fields
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  age: { type: Number },
  education: { type: String },
  enrolledCourses: [{ type: String }],
  scholarshipDiscount: { type: Number, default: 0 },
  counsellingBookings: [{
    type: { type: String, enum: ['career', 'psychological'] },
    counsellor: String,
    date: Date,
    status: { type: String, default: 'pending' }
  }],
  
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
