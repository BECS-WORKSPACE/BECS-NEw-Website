const mongoose = require('mongoose');

const teacherActivitySchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { 
    type: String, 
    enum: ['CREATED_ASSIGNMENT', 'GRADED_SUBMISSION', 'STARTED_LIVE_CLASS', 'UPDATED_LESSON', 'UPDATED_COURSE', 'PUBLISHED_COURSE'],
    required: true 
  },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true }, 
  targetModel: { type: String, enum: ['Course', 'Assignment', 'LiveClass', 'Lesson'], required: true }
}, { timestamps: true });

// Optimize for quickly fetching an audit log for a specific teacher or course
teacherActivitySchema.index({ teacherId: 1, createdAt: -1 });
teacherActivitySchema.index({ targetId: 1, targetModel: 1 });

module.exports = mongoose.model('TeacherActivity', teacherActivitySchema);
