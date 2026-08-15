const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  
  lastAccessed: { type: Date, default: Date.now }
}, { timestamps: true });

// Update the timestamp when a user watches a video
watchHistorySchema.index({ user: 1, lastAccessed: -1 });

module.exports = mongoose.model('WatchHistory', watchHistorySchema);
