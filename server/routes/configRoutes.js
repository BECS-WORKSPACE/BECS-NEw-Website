const express = require('express');
const router = express.Router();
const SystemConfig = require('../models/SystemConfig');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/config/pricing
// @desc    Get subscription pricing
// @access  Public
router.get('/pricing', async (req, res) => {
  try {
    let config = await SystemConfig.findOne({ key: 'SUBSCRIPTION_PRICING' });
    
    // Auto-initialize if not present
    if (!config) {
      config = await SystemConfig.create({
        key: 'SUBSCRIPTION_PRICING',
        value: {
          originalPrice: 7999,
          discountedPrice: 4999
        },
        description: 'Global monthly subscription pricing for EduVerse Premium.'
      });
    }
    
    res.json(config.value);
  } catch (error) {
    console.error('Error fetching pricing config:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/config/pricing
// @desc    Update subscription pricing
// @access  Private/Admin
router.put('/pricing', protect, admin, async (req, res) => {
  try {
    const { originalPrice, discountedPrice } = req.body;
    
    if (!originalPrice || !discountedPrice) {
      return res.status(400).json({ message: 'Missing required pricing fields' });
    }

    const config = await SystemConfig.findOneAndUpdate(
      { key: 'SUBSCRIPTION_PRICING' },
      { 
        value: { originalPrice, discountedPrice } 
      },
      { new: true, upsert: true }
    );
    
    res.json(config.value);
  } catch (error) {
    console.error('Error updating pricing config:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
