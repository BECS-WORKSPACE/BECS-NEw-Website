const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');

// @route   POST /api/enquiries
// @desc    Submit a new enquiry
// @access  Public
router.post('/', async (req, res) => {
  const { name, phone, courseId, courseName, type, email, highestQualification, preparingFor, address, city, state, paymentId } = req.body;
  
  if (!name || !phone) {
    return res.status(400).json({ message: 'Name and Phone are required' });
  }
  
  try {
    const newEnquiry = await Enquiry.create({
      name,
      phone,
      email,
      courseId,
      courseName,
      type,
      highestQualification,
      preparingFor,
      address,
      city,
      state,
      paymentId
    });
    
    res.status(201).json({ 
      message: 'Enquiry submitted successfully!',
      enquiryId: newEnquiry._id
    });
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
