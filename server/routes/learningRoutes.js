const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const LearningProgress = require('../models/LearningProgress');
const Bookmark = require('../models/Bookmark');
const UserAnalytics = require('../models/UserAnalytics');
const CredentialEngine = require('../services/CredentialEngine');

// --- PROGRESS TRACKING ---

// @route   POST /api/learning/progress
// @desc    Update video watch time and completion status
// @access  Private (Student)
router.post('/progress', protect, async (req, res) => {
  const { courseId, lessonId, watchTimeSeconds, totalDurationSeconds, isCompleted } = req.body;
  
  try {
    const progress = await LearningProgress.findOneAndUpdate(
      { user: req.user._id, lesson: lessonId },
      { 
        course: courseId, 
        $max: { watchTimeSeconds: watchTimeSeconds }, // Never reduce watch time if they rewind
        totalDurationSeconds, 
        isCompleted,
        lastAccessed: Date.now()
      },
      { new: true, upsert: true }
    );

    // Update Analytics asynchronously (don't block the response)
    updateUserAnalytics(req.user._id, watchTimeSeconds, isCompleted);

    // Evaluate Certificate Eligibility asynchronously
    if (isCompleted) {
      CredentialEngine.evaluate(req.user._id, courseId).catch(err => console.error('Credential Check Error:', err));
    }

    res.json(progress);
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/learning/progress/course/:courseId
// @desc    Get all progress for a specific course
// @access  Private (Student)
router.get('/progress/course/:courseId', protect, async (req, res) => {
  try {
    const progress = await LearningProgress.find({ 
      user: req.user._id, 
      course: req.params.courseId 
    });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// --- BOOKMARKS ---

// @route   POST /api/learning/bookmarks
// @desc    Add a bookmark
// @access  Private
router.post('/bookmarks', protect, async (req, res) => {
  try {
    const { targetId, targetType, title, context } = req.body;
    const bookmark = await Bookmark.create({
      user: req.user._id,
      targetId,
      targetType,
      title,
      context
    });
    res.status(201).json(bookmark);
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'Already bookmarked' });
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/learning/bookmarks
// @desc    Get all bookmarks for user
// @access  Private
router.get('/bookmarks', protect, async (req, res) => {
  try {
    // Optionally filter by type: ?type=Video
    const filter = { user: req.user._id };
    if (req.query.type) filter.targetType = req.query.type;
    
    const bookmarks = await Bookmark.find(filter).sort('-createdAt');
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/learning/bookmarks/:id
// @desc    Remove a bookmark
// @access  Private
router.delete('/bookmarks/:id', protect, async (req, res) => {
  try {
    await Bookmark.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Bookmark removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Helper function to update streaks and time
async function updateUserAnalytics(userId, additionalSeconds, isNewCompletion) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    let analytics = await UserAnalytics.findOne({ user: userId });
    
    if (!analytics) {
      analytics = new UserAnalytics({ user: userId, currentStreak: 1, longestStreak: 1, lastActiveDate: new Date() });
    }

    // Handle Streak Logic
    if (analytics.lastActiveDate) {
      const lastActive = analytics.lastActiveDate.toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      if (lastActive === yesterday) {
        // Active yesterday, increment streak
        analytics.currentStreak += 1;
        if (analytics.currentStreak > analytics.longestStreak) {
          analytics.longestStreak = analytics.currentStreak;
        }
      } else if (lastActive < yesterday) {
        // Broke the streak
        analytics.currentStreak = 1;
      }
    }
    
    analytics.lastActiveDate = new Date();
    
    // We would calculate actual diff here if we tracked granular pings, 
    // but for simplicity we assume the client sends accurate total watchTime per session.
    
    if (isNewCompletion) {
      analytics.lessonsCompleted += 1;
    }
    
    // Update daily stats map
    const currentDaily = analytics.dailyStats.get(today) || 0;
    // Note: in a real production environment, you'd calculate the delta, not just add the total video time.
    // analytics.dailyStats.set(today, currentDaily + delta);
    
    await analytics.save();
  } catch (err) {
    console.error('Analytics Update Error:', err);
  }
}

module.exports = router;
