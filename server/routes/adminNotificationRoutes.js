const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const NotificationTemplate = require('../models/NotificationTemplate');
const NotificationService = require('../services/NotificationService');
const User = require('../models/User');

// @desc    Get all templates
// @route   GET /api/admin/notifications/templates
// @access  Private/Admin
router.get('/templates', protect, admin, async (req, res) => {
  try {
    const templates = await NotificationTemplate.find({});
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Create a template
// @route   POST /api/admin/notifications/templates
// @access  Private/Admin
router.post('/templates', protect, admin, async (req, res) => {
  try {
    const template = await NotificationTemplate.create(req.body);
    res.status(201).json(template);
  } catch (error) {
    res.status(400).json({ message: 'Invalid template data', error: error.message });
  }
});

// @desc    Send a Broadcast Notification
// @route   POST /api/admin/notifications/broadcast
// @access  Private/Admin
router.post('/broadcast', protect, admin, async (req, res) => {
  try {
    const { title, message, targetRole, actionText, actionLink } = req.body;
    
    // Find target users
    const query = {};
    if (targetRole && targetRole !== 'all') {
       // Note: Depending on User schema, legacy role is isAdmin boolean or role ObjectId
       if (targetRole === 'student') query.isAdmin = false;
       if (targetRole === 'teacher') query.role = 'Teacher'; // Adjust based on DB schema
    }
    
    const users = await User.find(query).select('_id');
    
    // Dispatch in batches (In production, push to BullMQ instead of awaiting in loop)
    const dispatches = users.map(user => 
      NotificationService.notify({
        userId: user._id,
        topic: 'marketing', // Defaulting broadcasts to marketing topic so users can opt-out
        metadata: {
          type: 'broadcast',
          priority: 'high',
          title,
          message,
          actionText,
          actionLink
        }
      })
    );
    
    // Fire and forget (don't await all, just return success to admin quickly)
    Promise.allSettled(dispatches).then(results => {
       console.log(`Broadcast completed. Attempted: ${dispatches.length}`);
    });

    res.json({ success: true, message: `Broadcast initiated for ${users.length} users.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Broadcast failed' });
  }
});

module.exports = router;
