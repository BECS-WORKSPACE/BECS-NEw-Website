const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  target: { type: String, required: true },
  duration: { type: String, required: true },
  mode: { type: String, required: true },
  center: { type: String, required: true },
  price: { type: String, required: true },
  originalPrice: { type: String },
  discount: { type: String },
  image: { type: String },
  description: { type: String },
  schedule: { type: String },
  faculty: { type: String },
  syllabus: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Course', courseSchema);
