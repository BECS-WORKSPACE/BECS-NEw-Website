const mongoose = require('mongoose');

const questionAttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  isCorrect: { type: Boolean, required: true },
  timeSpentSeconds: { type: Number, default: 0 },
  studentAnswer: { type: String } // Storing the student's selected answer or numerical input
}, { timestamps: true });

questionAttemptSchema.index({ user: 1, question: 1 });
questionAttemptSchema.index({ user: 1, isCorrect: 1 });

module.exports = mongoose.model('QuestionAttempt', questionAttemptSchema);
