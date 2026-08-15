const mongoose = require('mongoose');

const rubricSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true, unique: true },
  
  criteria: [{
    title: { type: String, required: true },
    description: { type: String },
    weightage: { type: Number, required: true }, // Max points for this criteria
    
    levels: [{
      points: { type: Number, required: true },
      description: { type: String, required: true }
    }]
  }]
}, { timestamps: true });

module.exports = mongoose.model('Rubric', rubricSchema);
