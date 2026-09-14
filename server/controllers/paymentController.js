const NotificationService = require('../services/NotificationService');
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
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
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
        const Course = require('../models/Course');
        await User.findByIdAndUpdate(req.user._id, {
          $addToSet: { enrolledCourses: courseId }
        });
        
        try {
          const course = await Course.findById(courseId);
          NotificationService.notify({
            userId: req.user._id,
            topic: 'courseUpdates',
            templateName: 'enrollment_success',
            variables: {
              name: req.user.name || 'Student',
              courseName: course ? course.title : 'Premium Course'
            },
            metadata: {
              type: 'course',
              actionText: 'Start Learning',
              actionLink: '/dashboard/student'
            }
          });
        } catch(e) { console.error('Notification error:', e); }
      }

      // If purpose is subscription, activate premium
      if ((req.body.purpose === 'subscription' || req.body.purpose === 'course_subscription') && req.user) {
        const User = require('../models/User');
        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + 30); // 30 days from now
        
        await User.findByIdAndUpdate(req.user._id, {
          isPremium: true,
          subscriptionValidUntil: validUntil
        });
      }

      // If purpose is platform enrollment
      if (req.body.purpose === 'platform_enrollment' && req.user) {
        const User = require('../models/User');
        await User.findByIdAndUpdate(req.user._id, {
          enrollmentStatus: 'ENROLLED'
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

// @desc    Create a Razorpay Order for Platform Enrollment (₹999)
// @route   POST /api/payments/create-enrollment-order
// @access  Private
const createEnrollmentOrder = async (req, res) => {
  try {
    const user = req.user;
    
    if (user.enrollmentStatus === 'ENROLLED') {
      return res.status(400).json({ message: 'User is already enrolled' });
    }

    const amount = 999; // Hardcoded to prevent client-side manipulation

    const options = {
      amount: amount * 100, // paise
      currency: 'INR',
      receipt: `enroll_${user._id}_${Date.now()}`,
      notes: {
        userId: user._id.toString(),
        purpose: 'platform_enrollment'
      }
    };

    const order = await razorpay.orders.create(options);
    
    // Update user status
    user.enrollmentStatus = 'PAYMENT_PENDING';
    await user.save();

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Error creating enrollment order:', error);
    res.status(500).json({ message: 'Failed to create enrollment order' });
  }
};

// @desc    Create a Razorpay Subscription Order (simulated via standard order)
// @route   POST /api/payments/create-subscription-order
// @access  Private
const createSubscriptionOrder = async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    
    // Base price
    const basePrice = 4999;
    
    // Calculate discounted price
    const discount = user.scholarshipDiscount || 0;
    const finalAmount = Math.max(0, basePrice - (basePrice * (discount / 100)));

    const options = {
      amount: Math.round(finalAmount * 100),
      currency: 'INR',
      receipt: `sub_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        purpose: 'course_subscription'
      }
    };

    const order = await razorpay.orders.create(options);

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      discountApplied: discount,
      basePrice,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Error creating subscription order:', error);
    res.status(500).json({ message: 'Failed to create subscription order' });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  createEnrollmentOrder,
  createSubscriptionOrder
};
