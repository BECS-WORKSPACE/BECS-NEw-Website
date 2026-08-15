const mongoose = require('mongoose');

const certificateAuditLogSchema = new mongoose.Schema({
  certificate: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate', required: true },
  
  action: {
    type: String,
    enum: ['issued', 'revoked', 'reissued', 'downloaded', 'verified_publicly', 'shared_social'],
    required: true
  },
  
  // Who performed the action (can be null if system/public)
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  reason: { type: String },
  
  // Capture request data for public verifications (IP, User Agent)
  ipAddress: { type: String },
  userAgent: { type: String }

}, { timestamps: true });

// For querying history of a specific certificate
certificateAuditLogSchema.index({ certificate: 1, createdAt: -1 });

module.exports = mongoose.model('CertificateAuditLog', certificateAuditLogSchema);
