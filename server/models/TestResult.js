const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  attemptId: { type: mongoose.Schema.Types.ObjectId, ref: 'TestAttempt', required: true, unique: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  score: { type: Number, required: true, default: 0 },
  percentile: { type: Number, default: 0 }, // Calculated asynchronously via CRON
  
  totalCorrect: { type: Number, default: 0 },
  totalIncorrect: { type: Number, default: 0 },
  totalUnanswered: { type: Number, default: 0 },
  
  accuracyPercentage: { type: Number, default: 0 },
  
  // Granular Topic Performance
  topicAnalysis: [{
    topic: { type: String },
    accuracy: { type: Number }, // percentage
    timeSpent: { type: Number }, // seconds
    totalQuestions: { type: Number },
    correctQuestions: { type: Number }
  }]
}, { timestamps: true });

// Efficient lookups for leaderboards
testResultSchema.index({ testId: 1, score: -1 });
testResultSchema.index({ studentId: 1, testId: 1 });

module.exports = mongoose.model('TestResult', testResultSchema);
