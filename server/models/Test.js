const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  
  // Optional linkage to a specific course
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  
  durationMinutes: { type: Number, required: true, default: 60 },
  totalMarks: { type: Number, default: 0 },
  
  // The array of questions that make up this test
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  
  settings: {
    shuffleQuestions: { type: Boolean, default: true },
    shuffleOptions: { type: Boolean, default: true },
    allowReview: { type: Boolean, default: true }, // Can students go back to previous questions?
    showInstantResult: { type: Boolean, default: true }, // Can they see results immediately after submit?
    isPremium: { type: Boolean, default: false } // Requires subscription
  },
  
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);
