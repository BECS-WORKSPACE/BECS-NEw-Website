const mongoose = require('mongoose');

const entitlementSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // What grants this entitlement?
  sourceType: {
    type: String,
    enum: ['subscription', 'admin', 'coupon', 'legacy_migration'],
    required: true
  },
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' }, // If sourceType is subscription
  
  // What does this entitlement grant access to?
  // If course is null, it might be a global platform-level entitlement based on subscription features
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, 
  
  // Status and Expiration
  status: {
    type: String,
    enum: ['active', 'inactive', 'revoked'],
    default: 'active'
  },
  validUntil: { type: Date }, // Null means lifetime access
  
}, { timestamps: true });

// Optimize lookups for access checking
entitlementSchema.index({ user: 1, status: 1 });
entitlementSchema.index({ user: 1, course: 1 });

module.exports = mongoose.model('Entitlement', entitlementSchema);
