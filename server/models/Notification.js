const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'system', 'course', 'lesson', 'live_class', 'assignment', 'mock_test', 
      'payment', 'subscription', 'certificate', 'community', 'discussion', 
      'teacher', 'admin', 'marketing', 'security', 'broadcast'
    ],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'critical'],
    default: 'normal'
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  
  // Interactive Elements
  actionText: { type: String }, // e.g. "View Course", "Renew Now"
  actionLink: { type: String },
  
  // Rich context payload for advanced UI rendering
  metadata: { type: mongoose.Schema.Types.Mixed },
  
  // State Tracking
  status: {
    type: String,
    enum: ['unread', 'read', 'archived', 'deleted'],
    default: 'unread'
  },
  
  // Auditing
  readAt: { type: Date },
  clickedAt: { type: Date }
}, { timestamps: true });

// Optimize for dashboard queries (fetch latest unread)
notificationSchema.index({ user: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
