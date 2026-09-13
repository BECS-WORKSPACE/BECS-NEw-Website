const Question = require('../models/Question');
const Test = require('../models/Test');

exports.createQuestion = async (req, res) => {
  try {
    const { title, type, difficulty, content, options, correctExplanation, marks, tags, isPYQ, pyqYear, pyqExam } = req.body;
    const question = await Question.create({
      title, type, difficulty, content, options, correctExplanation, marks, tags, isPYQ, pyqYear, pyqExam,
      createdBy: req.user._id,
      status: 'published'
    });
    res.status(201).json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create question' });
  }
};

exports.getTeacherQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch questions' });
  }
};

exports.createTest = async (req, res) => {
  try {
    const { title, description, courseId, durationMinutes, totalMarks, questions } = req.body;
    const test = await Test.create({
      title, description, courseId, durationMinutes, totalMarks, questions,
      createdBy: req.user._id,
      status: 'published'
    });
    res.status(201).json(test);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create test' });
  }
};

exports.getTeacherTests = async (req, res) => {
  try {
    const tests = await Test.find({ createdBy: req.user._id }).populate('courseId', 'title').sort({ createdAt: -1 });
    res.status(200).json(tests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tests' });
  }
};

const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

exports.createAssignment = async (req, res) => {
  try {
    const { title, description, instructions, courseId, type, maxMarks, dueDate } = req.body;
    const assignment = await Assignment.create({
      title, description, instructions, courseId, type, maxMarks, dueDate,
      createdBy: req.user._id,
      status: 'published'
    });
    res.status(201).json(assignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create assignment' });
  }
};

exports.getTeacherAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ createdBy: req.user._id }).populate('courseId', 'title').sort({ createdAt: -1 });
    res.status(200).json(assignments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch assignments' });
  }
};

exports.getTeacherSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.query;
    if (!assignmentId) return res.status(400).json({ message: 'Assignment ID required' });
    
    // Check if teacher owns this assignment
    const assignment = await Assignment.findOne({ _id: assignmentId, createdBy: req.user._id });
    if (!assignment) return res.status(403).json({ message: 'Unauthorized' });

    const submissions = await Submission.find({ assignmentId })
      .populate('studentId', 'name email profileImage');
      
    res.status(200).json(submissions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch submissions' });
  }
};

exports.evaluateSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade, feedbackText } = req.body;
    
    const submission = await Submission.findByIdAndUpdate(id, {
      grade,
      feedbackText,
      status: 'graded',
      gradedBy: req.user._id,
      gradedAt: new Date()
    }, { new: true });

    res.status(200).json(submission);
  } catch (err) {
    res.status(500).json({ message: 'Failed to evaluate submission' });
  }
};
