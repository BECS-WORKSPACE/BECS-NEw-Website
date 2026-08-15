const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  refreshToken: { type: String, required: true },
  deviceInfo: { type: String },
  ipAddress: { type: String },
  isValid: { type: Boolean, default: true },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

// Create an index to automatically expire documents
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Session', sessionSchema);
