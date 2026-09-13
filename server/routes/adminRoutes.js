const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// All routes here should be protected and restricted to Admin
router.use(protect);
router.use(authorize('admin', 'Admin', 'Super Admin'));

// Dashboard Stats
router.get('/overview', adminController.getOverviewStats);

// People Management
router.get('/students', adminController.getStudents);
router.get('/teachers', adminController.getTeachers);

// Content
router.get('/content-approvals', adminController.getPendingContent);

// Finance
router.get('/enrollments', adminController.getEnrollments);
router.get('/subscriptions', adminController.getSubscriptions);
router.get('/payments', adminController.getPayments);

// Analytics
router.get('/learning-analytics', adminController.getLearningAnalytics);

// CMS / Extra
router.get('/scholarships', adminController.getScholarships);

module.exports = router;
