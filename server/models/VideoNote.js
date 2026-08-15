const mongoose = require('mongoose');

const videoNoteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  
  timestamp: { type: Number, required: true }, // in seconds
  text: { type: String, required: true },
  color: { type: String, default: '#fbbf24' } // For color-coding notes
}, { timestamps: true });

// Index for fast retrieval of a student's notes for a specific video
videoNoteSchema.index({ user: 1, lessonId: 1 });

module.exports = mongoose.model('VideoNote', videoNoteSchema);
