const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  subject: { type: String, required: true },
  chapter: { type: String },
  title: { type: String, required: true },
  text: { type: String, required: true },
  imageUrls: [{ type: String }],
  status: { type: String, enum: ['pending', 'answered', 'resolved'], default: 'pending' },
  
  // Resolution details
  answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  answerText: { type: String },
  answeredAt: { type: Date }
}, { timestamps: true });

doubtSchema.index({ student: 1, status: 1 });
doubtSchema.index({ status: 1 });

module.exports = mongoose.model('Doubt', doubtSchema);
