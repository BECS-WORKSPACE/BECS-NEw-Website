const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Student APIs
router.get('/search', libraryController.searchLibrary);
router.get('/:id', libraryController.getResource);
router.get('/:id/download', libraryController.getDownloadUrl);
router.post('/:id/bookmark', libraryController.toggleBookmark);

// Admin / Teacher APIs
router.post('/', authorize('Teacher', 'Admin', 'teacher', 'admin'), libraryController.createResource);

module.exports = router;
