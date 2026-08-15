const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Student fetching
router.get('/course/:courseId', assignmentController.getCourseAssignments);

// Student Submissions
router.post('/submissions/:assignmentId', assignmentController.handleSubmission);

// Teacher/Admin Management
router.post('/', authorize('Teacher', 'Admin', 'teacher', 'admin'), assignmentController.createAssignment);
router.put('/submissions/:submissionId/grade', authorize('Teacher', 'Admin', 'teacher', 'admin'), assignmentController.gradeSubmission);

module.exports = router;
