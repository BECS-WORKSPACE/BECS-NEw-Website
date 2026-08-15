const mongoose = require('mongoose');

const paymentTransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, // For one-time commerce purchases
  
  // Provider specifics
  provider: { type: String, default: 'razorpay' },
  providerOrderId: { type: String, unique: true, sparse: true },
  providerPaymentId: { type: String, unique: true, sparse: true },
  
  // Money
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  
  // Status Tracking
  status: {
    type: String,
    enum: ['created', 'pending', 'processing', 'successful', 'failed', 'cancelled', 'refunded', 'partially_refunded'],
    default: 'created'
  },
  
  paymentMethod: { type: String }, // e.g., 'card', 'upi', 'netbanking'
  
  // Failure / Refund tracking
  errorReason: { type: String },
  refundId: { type: String },
  
  // Audit
  ipAddress: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

module.exports = mongoose.model('PaymentTransaction', paymentTransactionSchema);
