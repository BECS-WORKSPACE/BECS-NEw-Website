const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, getDashboardStats);

module.exports = router;
