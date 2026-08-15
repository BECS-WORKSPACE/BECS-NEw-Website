const mongoose = require('mongoose');

const certificateEligibilityRuleSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  // Can be expanded to 'Program' or 'Batch' later
  
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'CertificateTemplate', required: true },

  rules: {
    minVideoCompletionPercent: { type: Number, default: 0 }, // e.g., 80
    minFinalTestScore: { type: Number, default: 0 }, // e.g., 60
    requireAllAssignmentsPassed: { type: Boolean, default: false },
    requireLiveAttendancePercent: { type: Number, default: 0 }
  },

  // Should the system automatically generate it when rules are met, or wait for admin?
  autoIssue: { type: Boolean, default: true },
  
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Ensure only one active rule per course for a specific certificate type
certificateEligibilityRuleSchema.index({ course: 1, isActive: 1 });

module.exports = mongoose.model('CertificateEligibilityRule', certificateEligibilityRuleSchema);
