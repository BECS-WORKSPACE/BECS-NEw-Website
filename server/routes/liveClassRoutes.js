const express = require('express');
const router = express.Router();
const liveClassController = require('../controllers/liveClassController');
const { protect, authorize } = require('../middleware/auth');

// Note: authorize('Teacher', 'Admin', 'teacher', 'admin') handles both V2 role objects and legacy strings

// Student route: Get upcoming classes for a course
router.get('/course/:courseId', protect, liveClassController.getUpcomingClassesByCourse);

// Instructor routes
router.get('/instructor', protect, authorize('Teacher', 'Admin', 'teacher', 'admin'), liveClassController.getInstructorClasses);
router.post('/schedule', protect, authorize('Teacher', 'Admin', 'teacher', 'admin'), liveClassController.scheduleClass);

// Webhooks (Called by Jitsi/Cloud - Do NOT protect with JWT)
router.post('/webhook/recording-ready', liveClassController.handleRecordingWebhook);

module.exports = router;
