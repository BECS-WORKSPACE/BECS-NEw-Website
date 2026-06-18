const Stripe = require('stripe');
const Order = require('../models/Order');

// Initialize Stripe with the secret key from env
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create a PaymentIntent
// @route   POST /api/payments/create-intent
// @access  Private
const createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Find the order to get the total amount
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Stripe expects amount in minimum currency unit (paise for INR)
    // We assume totalPrice is in INR rupees
    const amountInPaise = Math.round(order.totalPrice * 100);

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPaise,
      currency: 'inr',
      // We can add metadata to help reconcile later
      metadata: {
        orderId: order._id.toString(),
        userId: order.user.toString()
      },
      // Payment method types. Since we're using PaymentElement, we can let it automatically configure
      // but to be explicit about UPI we can pass it, or just use automatic_payment_methods
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: 'Failed to create payment intent' });
  }
};

module.exports = {
  createPaymentIntent
};
