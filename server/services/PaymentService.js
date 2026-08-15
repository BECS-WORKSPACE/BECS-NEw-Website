const razorpayProvider = require('./providers/RazorpayProvider');

class PaymentService {
  constructor() {
    // Determine provider based on config or defaults to Razorpay
    this.provider = razorpayProvider; 
  }

  async createOrder(data) {
    return this.provider.createOrder(data);
  }

  verifyPaymentSignature(orderId, paymentId, signature) {
    return this.provider.verifyPaymentSignature(orderId, paymentId, signature);
  }

  verifyWebhookSignature(rawBody, signature) {
    return this.provider.verifyWebhookSignature(rawBody, signature);
  }
}

module.exports = new PaymentService();
