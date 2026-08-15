const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { protect } = require('../middleware/auth');

// Video Progress & Tracking
router.post('/progress', protect, videoController.syncProgress);
router.get('/resume/:lessonId', protect, videoController.getResumeData);

// Timestamp Notes
router.post('/notes', protect, videoController.createNote);
router.get('/notes/:lessonId', protect, videoController.getNotes);
router.delete('/notes/:noteId', protect, videoController.deleteNote);

module.exports = router;
