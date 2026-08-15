const mongoose = require('mongoose');

const liveAttendanceSchema = new mongoose.Schema({
  liveClassId: { type: mongoose.Schema.Types.ObjectId, ref: 'LiveClass', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Array of join/leave timestamps to calculate accurate duration even if student drops connection
  sessions: [{
    joinTime: { type: Date, required: true },
    leaveTime: { type: Date }
  }],
  
  // Calculated Fields (Updated by a background job when class ends)
  totalDurationSeconds: { type: Number, default: 0 },
  attendancePercentage: { type: Number, default: 0 },
  
  // Status evaluated at the end of class
  status: { 
    type: String, 
    enum: ['present', 'late', 'absent', 'pending'], 
    default: 'pending' 
  }
}, { timestamps: true });

// Compound index to ensure one master attendance record per student per class
liveAttendanceSchema.index({ liveClassId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('LiveAttendance', liveAttendanceSchema);
