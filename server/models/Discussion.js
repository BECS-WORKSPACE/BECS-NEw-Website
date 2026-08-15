const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true }, // Rich Text / Markdown / Math
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Context Binding
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, 
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }, 
  
  topicTags: [{ type: String }],
  attachments: [{ 
    fileUrl: String, 
    fileType: String 
  }],
  
  // States
  status: { type: String, enum: ['open', 'resolved', 'closed', 'pinned'], default: 'open' },
  isPremium: { type: Boolean, default: false },
  
  // Engagement
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
  
  bestReplyId: { type: mongoose.Schema.Types.ObjectId, ref: 'DiscussionReply' }
}, { timestamps: true });

// Optimize querying for a specific course or lesson
discussionSchema.index({ courseId: 1, status: 1 });
discussionSchema.index({ lessonId: 1 });

module.exports = mongoose.model('Discussion', discussionSchema);
