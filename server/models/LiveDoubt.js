const mongoose = require('mongoose');

const liveDoubtSchema = new mongoose.Schema({
  liveClassId: { type: mongoose.Schema.Types.ObjectId, ref: 'LiveClass', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  question: { type: String, required: true },
  isResolved: { type: Boolean, default: false },
  resolvedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('LiveDoubt', liveDoubtSchema);
