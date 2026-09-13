const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/teacherDashboardController');
const courseController = require('../controllers/teacherCourseController');
const assessmentController = require('../controllers/teacherAssessmentController');
const { protect, authorize } = require('../middleware/auth');

// Apply protection and RBAC to all teacher routes
router.use(protect);
router.use(authorize('Teacher', 'Senior Teacher', 'Course Coordinator', 'Head Faculty', 'Admin', 'teacher', 'admin', 'Super Admin'));

// Dashboard Stats
router.get('/dashboard', dashboardController.getDashboardStats);
router.get('/performance', dashboardController.getPerformanceStats);

// Course Management (Sandboxed)
router.get('/courses', courseController.getMyCourses);
router.get('/students', courseController.getStudents);
router.get('/materials', courseController.getMaterials);
router.get('/batches', courseController.getBatches);
router.post('/batches', courseController.createBatch);
router.get('/attendance', courseController.getAttendance);
router.post('/attendance', courseController.markAttendance);
router.get('/mentorship', courseController.getMentorshipSessions);
router.post('/mentorship', courseController.createMentorshipSlot);
router.put('/mentorship/:id/status', courseController.updateMentorshipStatus);
router.get('/announcements', courseController.getAnnouncements);
router.post('/announcements', courseController.createAnnouncement);
router.put('/courses/:id/draft', courseController.updateCourseDraft);

// Assessment Management
router.get('/questions', assessmentController.getTeacherQuestions);
router.post('/questions', assessmentController.createQuestion);
router.get('/tests', assessmentController.getTeacherTests);
router.post('/tests', assessmentController.createTest);
router.get('/assignments', assessmentController.getTeacherAssignments);
router.post('/assignments', assessmentController.createAssignment);
router.get('/submissions', assessmentController.getTeacherSubmissions);
router.put('/submissions/:id/evaluate', assessmentController.evaluateSubmission);

module.exports = router;
