const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const { protect } = require('../middleware/auth');

// Protected Routes
router.use(protect);

// Exam Engine
router.post('/attempts/start/:testId', testController.startOrResumeAttempt);
router.put('/attempts/:attemptId/autosave', testController.autoSaveAttempt);
router.post('/attempts/:attemptId/submit', testController.submitAttempt);
router.get('/attempts/:attemptId/result', testController.getAttemptResult);

module.exports = router;
