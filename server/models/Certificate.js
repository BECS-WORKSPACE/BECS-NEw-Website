const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'CertificateTemplate', required: true },
  
  // Cryptographically secure identifiers
  certificateNumber: { type: String, required: true, unique: true }, // e.g., EDU-2026-X8F9
  verificationId: { type: String, required: true, unique: true }, // UUID for public URL
  
  status: {
    type: String,
    enum: ['valid', 'revoked', 'expired', 'superseded', 'invalid'],
    default: 'valid'
  },
  
  // Snapshotted data at time of issuance (prevents historical data changing if course is renamed)
  metadata: {
    studentName: { type: String, required: true },
    courseName: { type: String },
    achievementText: { type: String },
    score: { type: String }
  },

  issuedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }, // Optional for credentials that require renewal
  
  // Generated Assets
  pdfUrl: { type: String },
  qrCodeUrl: { type: String },
  
  // Revocation Data
  revokedAt: { type: Date },
  revocationReason: { type: String },
  revokedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin who revoked it
  
  // Reissue tracking
  previousVersion: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' },
  nextVersion: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' }

}, { timestamps: true });

// Index is automatically created by unique: true on verificationId
// Optimize for student dashboard
certificateSchema.index({ student: 1, status: 1 });

module.exports = mongoose.model('Certificate', certificateSchema);
