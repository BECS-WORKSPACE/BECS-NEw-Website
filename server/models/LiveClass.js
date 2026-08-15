const mongoose = require('mongoose');

const liveClassSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  
  // Link to existing LMS structure
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Timing
  scheduledStartTime: { type: Date, required: true },
  durationMinutes: { type: Number, required: true, default: 60 },
  
  // State
  status: { 
    type: String, 
    enum: ['scheduled', 'live', 'completed', 'cancelled'], 
    default: 'scheduled' 
  },
  
  // Meeting Configuration
  settings: {
    waitingRoom: { type: Boolean, default: false },
    recordAutomatically: { type: Boolean, default: true },
    allowStudentChat: { type: Boolean, default: true },
    allowStudentVideo: { type: Boolean, default: false },
    allowStudentAudio: { type: Boolean, default: false }
  },

  // Once completed, where is the recording?
  recordingUrl: { type: String },
  
  // Access Control - Array of user IDs or Batches explicitly allowed, 
  // though typically it inherits from courseId enrollment
  allowedBatches: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('LiveClass', liveClassSchema);
