const mongoose = require('mongoose');

const courseProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  lastAccessedLesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
  watchTimeSeconds: { type: Number, default: 0 },
  syllabusCompletionPercentage: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now }
}, { timestamps: true });

// Prevent duplicate progress entries for the same user-course pair
courseProgressSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('CourseProgress', courseProgressSchema);
