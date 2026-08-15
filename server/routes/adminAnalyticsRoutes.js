const express = require('express');
const router = express.Router();
const adminAnalyticsController = require('../controllers/adminAnalyticsController');
const { protect } = require('../middleware/auth'); // In production, add , adminAuth

// Get global video streaming KPIs
router.get('/overview', protect, adminAnalyticsController.getVideoAnalyticsOverview);

// Get specific course drop-off rates
router.get('/course/:courseId', protect, adminAnalyticsController.getCourseVideoAnalytics);

module.exports = router;
