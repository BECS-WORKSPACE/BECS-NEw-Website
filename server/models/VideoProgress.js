const mongoose = require('mongoose');

const videoProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  
  lastWatchedTimestamp: { type: Number, default: 0 }, // in seconds
  highestWatchedPercentage: { type: Number, default: 0 }, // 0 to 100
  totalDurationSeconds: { type: Number, default: 0 },
  
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date }
}, { timestamps: true });

// Ensure one progress record per user per lesson
videoProgressSchema.index({ user: 1, lessonId: 1 }, { unique: true });

module.exports = mongoose.model('VideoProgress', videoProgressSchema);
