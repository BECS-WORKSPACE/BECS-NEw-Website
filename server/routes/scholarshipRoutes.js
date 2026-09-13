const express = require('express');
const router = express.Router();
const { getTestQuestions, submitTest } = require('../controllers/scholarshipController');
const { protect } = require('../middlewares/auth');

router.get('/test', protect, getTestQuestions);
router.post('/test/submit', protect, submitTest);

module.exports = router;
