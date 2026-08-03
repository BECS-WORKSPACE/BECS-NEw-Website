const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

// @desc    Create a Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private
const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId, amount, purpose } = req.body;
    let finalAmount = amount;

    // If orderId is provided, fetch total price from DB (for ecommerce)
    if (orderId) {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      finalAmount = order.totalPrice;
    }

    if (!finalAmount) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    const options = {
      amount: Math.round(finalAmount * 100), // amount in the smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        orderId: orderId || 'course_enrollment',
        userId: req.user ? req.user._id.toString() : 'guest',
        purpose: purpose || 'purchase'
      }
    };

    const order = await razorpay.orders.create(options);

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Error creating razorpay order:', error);
    res.status(500).json({ message: 'Failed to create payment order' });
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payments/verify
// @access  Private
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment is verified
      
      // If courseId is provided and user is authenticated, enroll them
      if (courseId && req.user) {
        const User = require('../models/User');
        await User.findByIdAndUpdate(req.user._id, {
          $addToSet: { enrolledCourses: courseId }
        });
      }
      
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Error verifying razorpay payment:', error);
    res.status(500).json({ success: false, message: 'Failed to verify payment' });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment
};
