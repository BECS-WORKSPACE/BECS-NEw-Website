const mongoose = require('mongoose');

const testAttemptSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  startTime: { type: Date, required: true, default: Date.now },
  endTime: { type: Date }, // Will be set to startTime + durationMinutes upon creation
  
  autoSavedAt: { type: Date, default: Date.now },
  isSubmitted: { type: Boolean, default: false },
  
  // Array of answers maintaining the state of the palette
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    selectedOptionIds: [{ type: mongoose.Schema.Types.ObjectId }], // Use Array for multi-select support
    numericalValue: { type: Number },
    status: { 
      type: String, 
      enum: ['answered', 'marked_for_review', 'visited_unanswered', 'not_visited'], 
      default: 'not_visited' 
    },
    timeSpentSeconds: { type: Number, default: 0 }
  }],

  // Basic anti-cheat logs
  warnings: [{
    type: { type: String, enum: ['tab_switch', 'fullscreen_exit', 'network_drop'] },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Compound index to quickly find an active session for resume functionality
testAttemptSchema.index({ studentId: 1, testId: 1, isSubmitted: 1 });

module.exports = mongoose.model('TestAttempt', testAttemptSchema);
