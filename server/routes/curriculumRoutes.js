const express = require('express');
const router = express.Router();
const curriculumController = require('../controllers/curriculumController');
const { protect, authorize } = require('../middleware/auth'); // assuming adminAuth or similar exists, using protect for now

// Since we are building the foundation, we use 'protect' to ensure user is authenticated. 
// Later we can enforce role-based middleware (e.g. check if user is admin or course instructor)

router.post('/module', protect, authorize('Teacher', 'Admin', 'teacher', 'admin', 'Super Admin', 'god'), curriculumController.createModule);
router.post('/chapter', protect, authorize('Teacher', 'Admin', 'teacher', 'admin', 'Super Admin', 'god'), curriculumController.createChapter);
router.post('/lesson', protect, authorize('Teacher', 'Admin', 'teacher', 'admin', 'Super Admin', 'god'), curriculumController.createLesson);

// Fetch tree
router.get('/:courseId', protect, curriculumController.getCurriculum);

// Batch save for drag and drop
router.put('/reorder', protect, authorize('Teacher', 'Admin', 'teacher', 'admin', 'Super Admin', 'god'), curriculumController.reorderCurriculum);

module.exports = router;
