const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Course = require('../models/Course');
const mongoose = require('mongoose');

// --- TEACHER / ADMIN ROUTES ---

// Create an assignment
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, instructions, courseId, type, maxMarks, dueDate, isPremium } = req.body;
    
    const newAssignment = await Assignment.create({
      title,
      description,
      instructions,
      courseId,
      type,
      maxMarks,
      dueDate,
      isPremium,
      createdBy: req.user._id,
      status: 'published'
    });

    // Optionally link to Course
    await Course.findByIdAndUpdate(courseId, { $push: { assignments: newAssignment._id } });

    res.status(201).json(newAssignment);
  } catch (err) {
    console.error('Error creating assignment:', err);
    res.status(500).json({ message: 'Failed to create assignment' });
  }
};

// Teacher grades a submission
exports.gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { grade, feedbackText, requestResubmission } = req.body;

    const status = requestResubmission ? 'resubmission_requested' : 'graded';

    const submission = await Submission.findByIdAndUpdate(
      submissionId,
      {
        $set: {
          grade,
          feedbackText,
          status,
          gradedBy: req.user._id,
          gradedAt: Date.now()
        }
      },
      { new: true }
    );

    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    
    // Future: Trigger Notification to Student here
    res.status(200).json({ message: 'Grading complete', submission });
  } catch (err) {
    console.error('Error grading submission:', err);
    res.status(500).json({ message: 'Failed to grade' });
  }
};

// --- STUDENT ROUTES ---

// Get assignments for a specific course
exports.getCourseAssignments = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(200).json([]);
    }

    const assignments = await Assignment.find({ courseId, status: 'published' }).sort({ dueDate: 1 });
    res.status(200).json(assignments);
  } catch (err) {
    console.error('Error fetching assignments:', err);
    res.status(500).json({ message: 'Failed to fetch assignments' });
  }
};

// Save a Draft or Finalize Submission
exports.handleSubmission = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { submissionText, files, isFinalSubmit } = req.body;
    
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    // Check deadlines
    if (isFinalSubmit && !assignment.allowLateSubmission && new Date() > new Date(assignment.dueDate)) {
      return res.status(403).json({ message: 'Late submissions are not allowed for this assignment.' });
    }

    let submission = await Submission.findOne({ assignmentId, studentId: req.user._id });

    if (!submission) {
      // First time saving
      submission = new Submission({
        assignmentId,
        studentId: req.user._id,
        status: isFinalSubmit ? 'submitted' : 'draft',
        submissionText,
        files: files || []
      });
    } else {
      // Prevent overwriting a graded test unless requested
      if (submission.status === 'graded') {
        return res.status(403).json({ message: 'This assignment is already graded.' });
      }

      // If resubmitting, snapshot the old files for academic integrity
      if (submission.status === 'resubmission_requested' && isFinalSubmit) {
        submission.submissionHistory.push({
          submittedAt: submission.submittedAt,
          filesSnapshot: submission.files
        });
      }

      submission.submissionText = submissionText !== undefined ? submissionText : submission.submissionText;
      if (files) submission.files = files;
      
      if (isFinalSubmit) {
        submission.status = new Date() > new Date(assignment.dueDate) ? 'late' : 'submitted';
      }
    }

    if (isFinalSubmit) {
      submission.submittedAt = Date.now();
    }

    await submission.save();

    res.status(200).json({ message: isFinalSubmit ? 'Assignment submitted successfully' : 'Draft saved', submission });
  } catch (err) {
    console.error('Error handling submission:', err);
    res.status(500).json({ message: 'Failed to process submission' });
  }
};
