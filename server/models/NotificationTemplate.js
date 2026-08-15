const mongoose = require('mongoose');

const notificationTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., 'payment_success'
  description: { type: String },
  
  // Content blocks supporting handlebars-like syntax: {{studentName}}
  subject: { type: String, required: true },
  previewText: { type: String },
  bodyHtml: { type: String, required: true },
  bodyText: { type: String, required: true },
  
  // Call to Action
  ctaText: { type: String },
  ctaUrlTemplate: { type: String },
  
  // Which channels this template supports
  supportedChannels: [{ type: String, enum: ['email', 'in_app', 'push', 'sms', 'whatsapp'] }],
  
  // Expected variables for validation
  requiredVariables: [{ type: String }],
  
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('NotificationTemplate', notificationTemplateSchema);
