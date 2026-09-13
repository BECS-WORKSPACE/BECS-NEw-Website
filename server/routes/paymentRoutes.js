const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyRazorpayPayment, createEnrollmentOrder } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/create-order', protect, createRazorpayOrder);
router.post('/create-enrollment-order', protect, createEnrollmentOrder);
router.post('/verify', protect, verifyRazorpayPayment);

module.exports = router;
