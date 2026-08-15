const express = require('express');
const router = express.Router();
const UserAnalytics = require('../models/UserAnalytics');
const { protect } = require('../middleware/auth');

// Get User Analytics Summary
router.get('/summary', protect, async (req, res) => {
  try {
    let analytics = await UserAnalytics.findOne({ user: req.user._id });
    
    // If not found, create default analytics record
    if (!analytics) {
      analytics = await UserAnalytics.create({ user: req.user._id });
    }

    res.json(analytics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
});

// Update XP and Streaks (e.g. after watching a video or completing a test)
router.post('/record-activity', protect, async (req, res) => {
  try {
    const { xpGained, activityType } = req.body;
    let analytics = await UserAnalytics.findOne({ user: req.user._id });
    
    if (!analytics) {
      analytics = await UserAnalytics.create({ user: req.user._id });
    }

    // Update XP
    if (xpGained) {
      analytics.xpEarned += parseInt(xpGained);
    }

    // Streak Logic
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    if (analytics.lastActiveDate) {
      const lastActiveStr = new Date(analytics.lastActiveDate).toISOString().split('T')[0];
      const diffTime = Math.abs(now - new Date(analytics.lastActiveDate));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (lastActiveStr !== todayStr) {
        if (diffDays === 1) {
          analytics.currentStreak += 1; // Consecutive day
        } else if (diffDays > 1) {
          analytics.currentStreak = 1; // Streak broken
        }
      }
    } else {
      analytics.currentStreak = 1; // First day
    }
    
    if (analytics.currentStreak > analytics.longestStreak) {
      analytics.longestStreak = analytics.currentStreak;
    }
    
    analytics.lastActiveDate = now;
    
    await analytics.save();
    res.json(analytics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error recording activity' });
  }
});

module.exports = router;
