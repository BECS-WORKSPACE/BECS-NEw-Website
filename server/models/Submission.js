const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  status: { 
    type: String, 
    enum: ['draft', 'submitted', 'late', 'graded', 'resubmission_requested'],
    default: 'draft'
  },
  
  // The actual online answer written by the student (if not just uploading files)
  submissionText: { type: String }, 
  
  files: [{
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  submittedAt: { type: Date },
  
  // Grading Details
  grade: { type: Number },
  feedbackText: { type: String },
  feedbackFiles: [{ 
    fileName: { type: String }, 
    fileUrl: { type: String } 
  }],
  gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  gradedAt: { type: Date },
  
  // Versioning for integrity
  submissionHistory: [{
    submittedAt: { type: Date },
    filesSnapshot: Array
  }]
}, { timestamps: true });

// Compound index to quickly find a student's submission for a specific assignment
submissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });
submissionSchema.index({ status: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
