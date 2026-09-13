const express = require('express');
const router = express.Router();
const { 
  getMyCourses, 
  getCourseSyllabus, 
  getLessonDetails, 
  updateLessonProgress,
  getDashboardSummary
} = require('../controllers/lmsController');
const { protect } = require('../middleware/auth');

router.get('/my-courses', protect, getMyCourses);
router.get('/dashboard-summary', protect, getDashboardSummary);
router.get('/course/:id/syllabus', protect, getCourseSyllabus);
router.get('/lesson/:id', protect, getLessonDetails);
router.post('/lesson/:id/progress', protect, updateLessonProgress);

module.exports = router;
