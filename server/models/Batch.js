const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  maxStudents: { type: Number, default: 50 },
  startDate: { type: Date },
  endDate: { type: Date },
  status: { type: String, enum: ['upcoming', 'active', 'completed'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Batch', batchSchema);
