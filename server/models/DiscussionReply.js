const mongoose = require('mongoose');

const discussionReplySchema = new mongoose.Schema({
  discussionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Discussion', required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  body: { type: String, required: true },
  attachments: [{ 
    fileUrl: String, 
    fileType: String 
  }],
  
  isTeacherResponse: { type: Boolean, default: false },
  upvotes: { type: Number, default: 0 }
}, { timestamps: true });

// Optimize for fetching all replies of a single discussion thread quickly
discussionReplySchema.index({ discussionId: 1, createdAt: 1 });

module.exports = mongoose.model('DiscussionReply', discussionReplySchema);
