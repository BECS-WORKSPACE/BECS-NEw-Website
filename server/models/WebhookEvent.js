const mongoose = require('mongoose');

const webhookEventSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true }, // The unique ID provided by Razorpay (Crucial for Idempotency)
  provider: { type: String, default: 'razorpay' },
  type: { type: String, required: true }, // e.g., 'payment.captured', 'subscription.charged'
  payload: { type: mongoose.Schema.Types.Mixed }, // Full webhook body
  
  // Tracking processing state
  processed: { type: Boolean, default: false },
  processedAt: { type: Date },
  error: { type: String }
}, { timestamps: true });

// Fast lookup to prevent duplicate processing
webhookEventSchema.index({ eventId: 1, provider: 1 }, { unique: true });

module.exports = mongoose.model('WebhookEvent', webhookEventSchema);
