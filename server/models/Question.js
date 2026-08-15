const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['single_mcq', 'multi_mcq', 'numerical', 'match', 'true_false'], 
    default: 'single_mcq' 
  },
  difficulty: { type: Number, min: 1, max: 5, default: 3 }, // 1 = Easy, 5 = Very Hard
  
  // The actual question statement, can contain Markdown/HTML/LaTeX
  content: { type: String, required: true }, 
  
  options: [{
    text: { type: String, required: true }, // Option content
    isCorrect: { type: Boolean, default: false } // Only populated/checked server-side
  }],
  
  // For numerical answers
  numericalAnswer: { type: Number },
  numericalTolerance: { type: Number, default: 0 },

  // Detailed explanation shown after submission
  correctExplanation: { type: String }, 
  
  // Scoring
  marks: { 
    positive: { type: Number, required: true, default: 1 }, 
    negative: { type: Number, required: true, default: 0 } 
  },

  // Categorization for Analytics
  tags: [{ type: String }],
  topic: { type: String },
  subject: { type: String },
  
  // Lifecycle
  status: { type: String, enum: ['draft', 'approved', 'archived'], default: 'draft' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Ensure text indexes for fast question bank searching
questionSchema.index({ title: 'text', content: 'text', tags: 'text', topic: 'text', subject: 'text' });

module.exports = mongoose.model('Question', questionSchema);
