const mongoose = require('mongoose');

const notificationDeviceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Device specifics
  deviceId: { type: String, required: true }, // Hardware ID or Browser fingerprint
  pushToken: { type: String, required: true }, // FCM / APNS token
  
  platform: { 
    type: String, 
    enum: ['web', 'ios', 'android', 'desktop'], 
    default: 'web' 
  },
  
  browser: { type: String },
  os: { type: String },
  
  // Status
  isActive: { type: Boolean, default: true },
  lastActiveAt: { type: Date, default: Date.now }
}, { timestamps: true });

// A device ID should be unique per user to prevent duplicate push sends
notificationDeviceSchema.index({ user: 1, deviceId: 1 }, { unique: true });

module.exports = mongoose.model('NotificationDevice', notificationDeviceSchema);
