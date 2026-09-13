const mongoose = require('mongoose');

const scholarshipTestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [{
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true }
  }]
}, { timestamps: true });

module.exports = mongoose.model('ScholarshipTest', scholarshipTestSchema);
