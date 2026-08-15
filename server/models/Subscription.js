const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
  
  // External Provider mapping (e.g., Razorpay)
  provider: { type: String, default: 'razorpay' },
  providerSubscriptionId: { type: String, sparse: true },
  
  // Core Business State
  status: { 
    type: String, 
    enum: [
      'pending', 'active', 'trialing', 'past_due', 
      'grace_period', 'paused', 'cancelled', 'expired', 'payment_failed'
    ],
    default: 'pending'
  },
  
  // Timestamps
  currentPeriodStart: { type: Date },
  currentPeriodEnd: { type: Date },
  
  // Cancellation Logic
  cancelAtPeriodEnd: { type: Boolean, default: false },
  canceledAt: { type: Date },
  
  // Auditing
  notes: { type: String }
}, { timestamps: true });

// A user should not have multiple active subscriptions of the same plan (optional business rule)
// subscriptionSchema.index({ user: 1, plan: 1, status: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
