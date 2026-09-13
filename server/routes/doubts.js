const express = require('express');
const router = express.Router();
const { getDoubts, submitDoubt, answerDoubt } = require('../controllers/doubtController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getDoubts);
router.post('/', protect, submitDoubt);
router.put('/:id/answer', protect, answerDoubt);

module.exports = router;
