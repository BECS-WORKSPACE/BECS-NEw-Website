const mongoose = require('mongoose');

const notificationPreferenceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  
  // Channels
  channels: {
    inApp: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    whatsapp: { type: Boolean, default: false }
  },
  
  // Topics (Granular control)
  topics: {
    courseUpdates: { type: Boolean, default: true },
    liveClasses: { type: Boolean, default: true },
    assignments: { type: Boolean, default: true },
    tests: { type: Boolean, default: true },
    payments: { type: Boolean, default: true }, // Cannot be easily disabled for legal/billing
    subscriptions: { type: Boolean, default: true },
    community: { type: Boolean, default: true },
    marketing: { type: Boolean, default: false }, // Explicit opt-in recommended
    security: { type: Boolean, default: true }    // Force true typically
  }
}, { timestamps: true });

module.exports = mongoose.model('NotificationPreference', notificationPreferenceSchema);
