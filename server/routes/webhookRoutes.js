const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// The raw body parsing must be applied before this route if signature verification is needed,
// but since we are doing that in server/index.js via express.json({ verify: ... }),
// we can just route it directly here.

router.post('/razorpay', webhookController.handleWebhook);

module.exports = router;
