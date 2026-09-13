const mongoose = require('mongoose');

const mentorshipSessionSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Null if it's an available slot not yet booked
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  title: { type: String, required: true },
  description: { type: String },
  scheduledAt: { type: Date, required: true },
  durationMinutes: { type: Number, default: 30 },
  meetingLink: { type: String },
  status: { type: String, enum: ['available', 'booked', 'completed', 'cancelled'], default: 'available' }
}, { timestamps: true });

module.exports = mongoose.model('MentorshipSession', mentorshipSessionSchema);
