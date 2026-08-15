const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/teacherDashboardController');
const courseController = require('../controllers/teacherCourseController');
const { protect, authorize } = require('../middleware/auth');

// Apply protection and RBAC to all teacher routes
router.use(protect);
router.use(authorize('Teacher', 'Senior Teacher', 'Course Coordinator', 'Head Faculty', 'Admin', 'teacher', 'admin', 'Super Admin'));

// Dashboard Stats
router.get('/dashboard', dashboardController.getDashboardStats);

// Course Management (Sandboxed)
router.get('/courses', courseController.getMyCourses);
router.put('/courses/:id/draft', courseController.updateCourseDraft);

module.exports = router;
