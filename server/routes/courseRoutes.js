const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// @route   GET /api/courses
// @desc    Get all courses with optional filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (category) {
      query.target = { $regex: category, $options: 'i' };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('lessons', 'title duration isFreePreview');
      
    // Count total documents for pagination
    const count = await Course.countDocuments(query);

    res.json({
      courses,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalCourses: count
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/courses/:id
// @desc    Get a specific course by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Course not found (Invalid ID format)' });
    }

    const course = await Course.findById(req.params.id).populate('lessons');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
