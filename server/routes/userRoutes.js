const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const User = require('../models/User');

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('role');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.gender = req.body.gender || user.gender;
      user.dob = req.body.dob || user.dob;
      user.address = req.body.address || user.address;
      user.state = req.body.state || user.state;
      user.district = req.body.district || user.district;
      user.city = req.body.city || user.city;
      user.pinCode = req.body.pinCode || user.pinCode;
      user.country = req.body.country || user.country;
      user.education = req.body.education || user.education;
      user.highestEducation = req.body.highestEducation || user.highestEducation;
      user.preparingFor = req.body.preparingFor || user.preparingFor;
      user.institute = req.body.institute || user.institute;
      user.course = req.body.course || user.course;
      user.bio = req.body.bio || user.bio;
      
      // Update nested objects safely
      if (req.body.socialLinks) {
        user.socialLinks = { ...user.socialLinks, ...req.body.socialLinks };
      }
      if (req.body.preferences) {
        user.preferences = { ...user.preferences, ...req.body.preferences };
      }

      if (req.body.password) {
        const { hashPassword, isPasswordStrong } = require('../utils/security');
        // if(!isPasswordStrong(req.body.password)) { return res.status(400).json({ message: 'Weak password'}) }
        user.password = await hashPassword(req.body.password);
      }

      const updatedUser = await user.save();
      const userObj = updatedUser.toObject();
      delete userObj.password;
      
      res.json(userObj);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/profile/complete
// @desc    Complete Onboarding Profile
// @access  Private
router.post('/profile/complete', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { highestEducation, preparingFor, address, pinCode, city, state } = req.body;

    if (!highestEducation || !preparingFor || !address || !pinCode || !city || !state) {
      return res.status(400).json({ message: 'All fields are required to complete profile.' });
    }

    user.highestEducation = highestEducation;
    user.preparingFor = preparingFor;
    user.address = address;
    user.pinCode = pinCode;
    user.city = city;
    user.state = state;
    user.profileCompleted = true;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    // Basic pagination and filtering logic
    const page = Number(req.query.pageNumber) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const count = await User.countDocuments({});
    const users = await User.find({}).select('-password').limit(limit).skip(skip).populate('role');
    
    res.json({ users, page, pages: Math.ceil(count / limit), total: count });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/:id/role
// @desc    Assign role to user
// @access  Private/Admin
router.put('/:id/role', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Support assigning legacy role and object role simultaneously during migration
    if(req.body.legacyRole) user.legacyRole = req.body.legacyRole;
    if(req.body.roleId) user.role = req.body.roleId;

    await user.save();
    res.json({ message: 'Role updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/counselling/book
// @desc    Book a counselling session
// @access  Private
router.post('/counselling/book', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { type, date } = req.body; // type: 'career' or 'psychological'
    
    if (!type || !date) {
      return res.status(400).json({ message: 'Type and date are required' });
    }

    user.counsellingBookings.push({
      type,
      date,
      status: 'pending'
    });

    await user.save();
    res.status(200).json({ message: 'Counselling session booked successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error booking counselling' });
  }
});

module.exports = router;
