const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  courseId: { type: String },
  courseName: { type: String },
  type: { type: String, enum: ['Enrollment', 'Brochure', 'StudyMaterial', 'General'], default: 'General' },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Enquiry', enquirySchema);
