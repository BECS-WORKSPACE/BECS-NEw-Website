const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const NotificationPreference = require('../models/NotificationPreference');
const { protect } = require('../middleware/auth');

// @desc    Get all notifications for user
// @route   GET /api/notifications
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching notifications' });
  }
});

// @desc    Mark single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: 'read', readAt: new Date() },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating notification' });
  }
});

// @desc    Mark all as read
// @route   PUT /api/notifications/read-all
// @access  Private
router.put('/read-all', protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, status: 'unread' },
      { status: 'read', readAt: new Date() }
    );
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating notifications' });
  }
});

// @desc    Get User Notification Preferences
// @route   GET /api/notifications/preferences
// @access  Private
router.get('/preferences', protect, async (req, res) => {
  try {
    let prefs = await NotificationPreference.findOne({ user: req.user._id });
    if (!prefs) {
      prefs = await NotificationPreference.create({ user: req.user._id });
    }
    res.json(prefs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch preferences' });
  }
});

// @desc    Update User Notification Preferences
// @route   PUT /api/notifications/preferences
// @access  Private
router.put('/preferences', protect, async (req, res) => {
  try {
    const { channels, topics } = req.body;
    let prefs = await NotificationPreference.findOne({ user: req.user._id });
    
    if (prefs) {
      if (channels) prefs.channels = { ...prefs.channels, ...channels };
      if (topics) prefs.topics = { ...prefs.topics, ...topics };
      await prefs.save();
    } else {
      prefs = await NotificationPreference.create({ user: req.user._id, channels, topics });
    }
    
    res.json(prefs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update preferences' });
  }
});

module.exports = router;
