const Razorpay = require('razorpay');
const crypto = require('crypto');

class RazorpayProvider {
  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'dummy_id',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
    });
    this.webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'dummy_webhook_secret';
  }

  /**
   * Create an order in Razorpay
   * @param {Object} data { amount, currency, receipt, notes }
   */
  async createOrder(data) {
    const options = {
      amount: Math.round(data.amount * 100), // amount in paise
      currency: data.currency || 'INR',
      receipt: data.receipt || `rcpt_${Date.now()}`,
      notes: data.notes || {}
    };

    const order = await this.razorpay.orders.create(options);
    return {
      id: order.id,
      amount: order.amount / 100,
      currency: order.currency,
      status: order.status
    };
  }

  /**
   * Verify synchronous payment signature (Frontend checkout)
   */
  verifyPaymentSignature(orderId, paymentId, signature) {
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', this.razorpay.key_secret)
      .update(body.toString())
      .digest('hex');

    return expectedSignature === signature;
  }

  /**
   * Verify asynchronous webhook signature
   */
  verifyWebhookSignature(rawBody, signature) {
    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(rawBody)
      .digest('hex');

    return expectedSignature === signature;
  }
}

module.exports = new RazorpayProvider();
