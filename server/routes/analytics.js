const express = require('express');
const router = express.Router();
const { getPerformanceAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/performance', protect, getPerformanceAnalytics);

module.exports = router;
