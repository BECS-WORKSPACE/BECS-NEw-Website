const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // What is being bookmarked (e.g., Lesson ID, Document ID, Question ID)
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  // The type of entity being bookmarked to allow polymorphic relations
  targetType: { 
    type: String, 
    enum: ['Video', 'PDF', 'Note', 'Question', 'Course'], 
    required: true 
  },
  // Optional context (e.g. video timestamp to jump to, or a small note written by the student)
  context: { type: mongoose.Schema.Types.Mixed },
  title: { type: String, required: true } // Denormalized for fast rendering in lists
}, { timestamps: true });

bookmarkSchema.index({ user: 1, targetType: 1 });
bookmarkSchema.index({ user: 1, targetId: 1 }, { unique: true }); // Prevent duplicate bookmarks for same target

module.exports = mongoose.model('Bookmark', bookmarkSchema);
