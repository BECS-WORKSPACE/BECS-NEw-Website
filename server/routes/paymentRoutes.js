const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
  createRazorpayOrder, 
  verifyRazorpayPayment, 
  createEnrollmentOrder,
  createSubscriptionOrder 
} = require('../controllers/paymentController');

router.post('/create-order', protect, createRazorpayOrder);
router.post('/create-enrollment-order', protect, createEnrollmentOrder);
router.post('/create-subscription-order', protect, createSubscriptionOrder);
router.post('/verify', protect, verifyRazorpayPayment);

module.exports = router;
