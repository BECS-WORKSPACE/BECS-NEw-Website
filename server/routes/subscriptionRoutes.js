const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const Subscription = require('../models/Subscription');
const PaymentTransaction = require('../models/PaymentTransaction');
const PaymentService = require('../services/PaymentService');

// @desc    Initiate Subscription Checkout
// @route   POST /api/subscriptions/checkout
// @access  Private
router.post('/checkout', protect, async (req, res) => {
  try {
    const { planId } = req.body;

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan || plan.status !== 'active') {
      return res.status(404).json({ message: 'Valid active plan not found' });
    }

    // Check if user already has an active subscription for this plan
    const existingActive = await Subscription.findOne({
      user: req.user._id,
      plan: planId,
      status: { $in: ['active', 'grace_period'] }
    });

    if (existingActive) {
      return res.status(400).json({ message: 'You already have an active subscription for this plan' });
    }

    // Create a pending Subscription record
    const subscription = await Subscription.create({
      user: req.user._id,
      plan: plan._id,
      status: 'pending',
    });

    // Generate Order via Payment Provider (Razorpay)
    const orderData = {
      amount: plan.discountedPrice,
      currency: 'INR',
      notes: {
        userId: req.user._id.toString(),
        subscriptionId: subscription._id.toString(),
        purpose: 'subscription_checkout'
      }
    };

    const providerOrder = await PaymentService.createOrder(orderData);

    // Create a PaymentTransaction tracking record
    const transaction = await PaymentTransaction.create({
      user: req.user._id,
      subscription: subscription._id,
      amount: plan.discountedPrice,
      currency: 'INR',
      providerOrderId: providerOrder.id,
      status: 'created'
    });

    res.json({
      success: true,
      subscriptionId: subscription._id,
      transactionId: transaction._id,
      providerOrder
    });

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: 'Failed to initiate checkout' });
  }
});

// @desc    Get Current User's Subscriptions
// @route   GET /api/subscriptions/my-plan
// @access  Private
router.get('/my-plan', protect, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user._id })
      .populate('plan')
      .sort({ createdAt: -1 });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
