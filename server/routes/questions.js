const express = require('express');
const router = express.Router();
const { getQuestions, getMistakes, submitAttempt } = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getQuestions);
router.get('/mistakes', protect, getMistakes);
router.post('/attempt', protect, submitAttempt);

module.exports = router;
