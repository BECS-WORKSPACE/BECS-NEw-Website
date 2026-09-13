const Question = require('../models/Question');
const QuestionAttempt = require('../models/QuestionAttempt');

// Fetch questions for the question bank (with optional filters)
exports.getQuestions = async (req, res) => {
  try {
    const { subject, difficulty, isPYQ, limit = 50 } = req.query;
    
    let query = {};
    if (subject && subject !== 'All Subjects') query.subject = subject;
    if (difficulty && difficulty !== 'All Levels') query.difficulty = difficulty;
    if (isPYQ === 'true') query.isPYQ = true;
    else if (isPYQ === 'false') query.isPYQ = false;

    const questions = await Question.find(query).limit(Number(limit));
    res.json({ success: true, count: questions.length, questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving questions' });
  }
};

// Fetch mistakes for MistakeBook
exports.getMistakes = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all incorrect attempts for the user, populate the question details
    const incorrectAttempts = await QuestionAttempt.find({ user: userId, isCorrect: false })
      .populate('question')
      .sort({ createdAt: -1 });

    // Deduplicate (so if a student got the same question wrong twice, it only shows once in the mistake book)
    const uniqueMistakesMap = new Map();
    incorrectAttempts.forEach(attempt => {
      if (attempt.question && !uniqueMistakesMap.has(attempt.question._id.toString())) {
        uniqueMistakesMap.set(attempt.question._id.toString(), {
          attemptId: attempt._id,
          question: attempt.question,
          studentAnswer: attempt.studentAnswer,
          attemptedAt: attempt.createdAt
        });
      }
    });

    res.json({ success: true, mistakes: Array.from(uniqueMistakesMap.values()) });
  } catch (error) {
    console.error('Error fetching mistakes:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving mistakes' });
  }
};

// Record a question attempt
exports.submitAttempt = async (req, res) => {
  try {
    const userId = req.user._id;
    const { questionId, studentAnswer, timeSpentSeconds } = req.body;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    // Determine if correct based on question schema. 
    // Schema has an 'options' array with {text, isCorrect} OR a single 'correctOptionIndex' (we added earlier if modifying).
    // The existing schema has: options: [{ text, isCorrect }]
    let isCorrect = false;
    
    // Find the correct option text
    const correctOption = question.options.find(opt => opt.isCorrect);
    
    if (correctOption && studentAnswer === correctOption.text) {
      isCorrect = true;
    } else if (question.correctOptionIndex !== undefined) {
      // If we used the simplified schema
      if (question.options[question.correctOptionIndex] === studentAnswer || studentAnswer == question.correctOptionIndex) {
        isCorrect = true;
      }
    }

    const attempt = await QuestionAttempt.create({
      user: userId,
      question: questionId,
      studentAnswer,
      isCorrect,
      timeSpentSeconds
    });

    res.json({ 
      success: true, 
      isCorrect,
      correctAnswer: correctOption ? correctOption.text : null,
      explanation: question.correctExplanation || question.explanation
    });
  } catch (error) {
    console.error('Error submitting attempt:', error);
    res.status(500).json({ success: false, message: 'Server error submitting attempt' });
  }
};
