const PaymentService = require('../services/PaymentService');
const WebhookEvent = require('../models/WebhookEvent');
const PaymentTransaction = require('../models/PaymentTransaction');
const Subscription = require('../models/Subscription');
const Entitlement = require('../models/Entitlement');
const User = require('../models/User');
const NotificationService = require('../services/NotificationService');

/**
 * Handle incoming webhooks idempotently
 */
const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    
    // In Express, to verify webhook signature, we need the raw body. 
    // Assuming express.json() is configured with verify to populate req.rawBody
    const rawBody = req.rawBody || JSON.stringify(req.body);

    if (!PaymentService.verifyWebhookSignature(rawBody, signature)) {
      console.warn('Webhook signature verification failed.');
      return res.status(400).send('Invalid signature');
    }

    const eventId = req.headers['x-razorpay-event-id'] || req.body.id || `evt_${Date.now()}`;
    
    // Idempotency Check
    const existingEvent = await WebhookEvent.findOne({ eventId, provider: 'razorpay' });
    if (existingEvent) {
      console.log(`Webhook ${eventId} already processed. Ignoring duplicate.`);
      return res.status(200).send('OK'); // Acknowledge to provider to stop retries
    }

    // Save initial event state
    const webhookEvent = await WebhookEvent.create({
      eventId,
      provider: 'razorpay',
      type: req.body.event,
      payload: req.body
    });

    const payloadEntity = req.body.payload.payment?.entity || req.body.payload.order?.entity;

    // Route event based on type
    switch (req.body.event) {
      case 'payment.captured':
        await handlePaymentCaptured(payloadEntity);
        break;
      case 'payment.failed':
        await handlePaymentFailed(payloadEntity);
        break;
      // Future: subscription.charged, subscription.halted, refund.processed
      default:
        console.log(`Unhandled webhook event type: ${req.body.event}`);
    }

    // Mark as processed
    webhookEvent.processed = true;
    webhookEvent.processedAt = new Date();
    await webhookEvent.save();

    res.status(200).send('OK');
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).send('Internal Server Error');
  }
};

const handlePaymentCaptured = async (paymentEntity) => {
  const orderId = paymentEntity.order_id;
  const paymentId = paymentEntity.id;
  
  // Find the transaction record created during checkout
  const transaction = await PaymentTransaction.findOne({ providerOrderId: orderId });
  if (!transaction) {
    console.error(`Transaction not found for order ${orderId}`);
    return;
  }

  // Update Transaction
  transaction.status = 'successful';
  transaction.providerPaymentId = paymentId;
  transaction.paymentMethod = paymentEntity.method;
  await transaction.save();

  // If this was for a Subscription
  if (transaction.subscription) {
    const subscription = await Subscription.findById(transaction.subscription);
    if (subscription) {
      subscription.status = 'active';
      // Basic 30 day validity based on billingCycle logic (simplified here)
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 30);
      subscription.currentPeriodStart = new Date();
      subscription.currentPeriodEnd = validUntil;
      await subscription.save();

      // Create Entitlement
      await Entitlement.findOneAndUpdate(
        { user: subscription.user, subscription: subscription._id },
        { 
          sourceType: 'subscription',
          status: 'active',
          validUntil: validUntil
        },
        { upsert: true, new: true }
      );
      
      // Dispatch Success Notification
      await NotificationService.notify({
        userId: subscription.user,
        topic: 'payments',
        templateName: 'payment_success',
        metadata: {
          type: 'payment',
          priority: 'normal',
          title: 'Payment Successful! Subscription Activated.',
          message: 'Your payment was successful and your subscription is now active.',
          actionText: 'Go to Dashboard',
          actionLink: '/dashboard'
        },
        variables: {
          amount: (transaction.amount).toString()
        }
      });
    }
  }
};

const handlePaymentFailed = async (paymentEntity) => {
  const orderId = paymentEntity.order_id;
  const transaction = await PaymentTransaction.findOne({ providerOrderId: orderId });
  if (!transaction) return;

  transaction.status = 'failed';
  transaction.errorReason = paymentEntity.error_description || 'Payment Failed';
  await transaction.save();

  if (transaction.subscription) {
    const subscription = await Subscription.findById(transaction.subscription);
    if (subscription && subscription.status === 'pending') {
      subscription.status = 'payment_failed';
      await subscription.save();
      
      // Dispatch Failure Notification
      await NotificationService.notify({
        userId: subscription.user,
        topic: 'payments',
        templateName: 'payment_failed',
        metadata: {
          type: 'payment',
          priority: 'high',
          title: 'Action Required: Payment Failed',
          message: `Your recent payment attempt failed. Reason: ${transaction.errorReason}`,
          actionText: 'Retry Payment',
          actionLink: '/dashboard/subscription'
        },
        variables: {
          amount: (transaction.amount).toString(),
          reason: transaction.errorReason
        }
      });
    }
  }
};

module.exports = {
  handleWebhook
};
