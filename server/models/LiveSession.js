const mongoose = require('mongoose');

const liveSessionSchema = new mongoose.Schema({
  liveClassId: { type: mongoose.Schema.Types.ObjectId, ref: 'LiveClass', required: true },
  
  // The actual time the teacher clicked "Start Class"
  actualStartTime: { type: Date },
  actualEndTime: { type: Date },
  
  // Security Provider Metadata (e.g. Jitsi Room Name or 100ms Room ID)
  providerRoomId: { type: String, required: true, unique: true },
  providerType: { type: String, enum: ['jitsi', '100ms', 'zoom'], default: 'jitsi' },
  
  // Active state flags
  isActive: { type: Boolean, default: true },
  isRecording: { type: Boolean, default: false },
  
  // Dynamic Realtime Configuration overrides (Teacher toggles during meeting)
  currentSettings: {
    chatEnabled: { type: Boolean, default: true },
    screenShareLocked: { type: Boolean, default: true } // Only teacher can share by default
  },

  // Active Participants List (Snapshot for UI and recovery)
  activeParticipants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    socketId: { type: String },
    joinedAt: { type: Date },
    isHandRaised: { type: Boolean, default: false },
    isAudioMuted: { type: Boolean, default: true },
    isVideoMuted: { type: Boolean, default: true }
  }]
}, { timestamps: true });

module.exports = mongoose.model('LiveSession', liveSessionSchema);
