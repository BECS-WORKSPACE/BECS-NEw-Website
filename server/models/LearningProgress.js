const mongoose = require('mongoose');

const learningProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  
  // Progress tracking
  watchTimeSeconds: { type: Number, default: 0 },
  totalDurationSeconds: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
  
  // For "Continue Learning" functionality
  lastAccessed: { type: Date, default: Date.now }
}, { timestamps: true });

// Ensure a user only has one progress record per lesson
learningProgressSchema.index({ user: 1, lesson: 1 }, { unique: true });
// Fast query for all progress in a specific course
learningProgressSchema.index({ user: 1, course: 1 });

module.exports = mongoose.model('LearningProgress', learningProgressSchema);
