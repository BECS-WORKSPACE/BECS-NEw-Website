const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  type: { type: String, enum: ['direct', 'group', 'course_batch'], required: true },
  name: { type: String }, // Optional, mostly for 'group' or 'course_batch'
  
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // Relevant if type is 'course_batch'
  
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
}, { timestamps: true });

conversationSchema.index({ participants: 1 });
conversationSchema.index({ courseId: 1 });

module.exports = mongoose.model('Conversation', conversationSchema);
