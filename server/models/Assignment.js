const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  instructions: { type: String, required: true }, // Rich text / Markdown
  
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  
  type: { 
    type: String, 
    enum: ['homework', 'project', 'lab', 'case_study'],
    default: 'homework'
  },
  
  maxMarks: { type: Number, required: true, default: 100 },
  passingMarks: { type: Number, default: 40 },
  
  dueDate: { type: Date, required: true },
  allowLateSubmission: { type: Boolean, default: false },
  latePenaltyPercentage: { type: Number, default: 0 },
  
  isPremium: { type: Boolean, default: false },
  
  attachments: [{
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String }
  }],
  
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Index for querying assignments by course efficiently
assignmentSchema.index({ courseId: 1, status: 1 });

module.exports = mongoose.model('Assignment', assignmentSchema);
