const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  target: { type: String, required: true },
  duration: { type: String, required: true },
  mode: { type: String, enum: ['Online', 'Offline', 'Online / Offline'], default: 'Online / Offline' },
  center: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discount: { type: String },
  image: { type: String },
  description: { type: String },
  schedule: { type: String },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  facultyName: { type: String }, // Fallback for hardcoded data
  
  // Teacher Portal Enhancements
  assignedTeachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
  syllabus: [{ type: String }],
  badge: { type: String },
  rating: { type: Number, default: 0 },
  studentCount: { type: Number, default: 0 },
  language: { type: String },
  certificate: { type: Boolean, default: false },
  emi: { type: Boolean, default: false },
  seatsLeft: { type: Number },
  startsIn: { type: String },
  
  // Premium Filters & Discovery
  category: { type: String, default: 'General' },
  subcategory: { type: String },
  tags: [{ type: String }],
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'], default: 'All Levels' },
  isTrending: { type: Boolean, default: false },
  
  // Enterprise Relational Data
  version: { type: String, enum: ['legacy', 'v2'], default: 'legacy' },
  slug: { type: String, unique: true, sparse: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' },
  status: { type: String, enum: ['draft', 'pending_review', 'published', 'archived'], default: 'published' },
  promoVideo: { type: String },
  seoMetadata: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: [{ type: String }]
  },
  modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  liveClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LiveClass' }],
  tests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Test' }],
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],
  libraryResources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LibraryResource' }],
  discussions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Discussion' }],
  
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Text Index for Powerful Search
courseSchema.index({ title: 'text', description: 'text', target: 'text', category: 'text', tags: 'text' });

module.exports = mongoose.model('Course', courseSchema);
