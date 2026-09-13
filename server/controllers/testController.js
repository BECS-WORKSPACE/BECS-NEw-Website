const Test = require('../models/Test');
const TestAttempt = require('../models/TestAttempt');
const TestResult = require('../models/TestResult');
const Question = require('../models/Question');
const mongoose = require('mongoose');
const CredentialEngine = require('../services/CredentialEngine');

// List all tests for dashboard
exports.listTests = async (req, res) => {
  try {
    const studentId = req.user._id;
    const isPremium = req.user.isPremium; // Assuming protect middleware or user lookup sets this

    const tests = await Test.find({ status: 'published' }).select('title description courseId durationMinutes totalMarks settings');
    
    // Fetch attempts for this student to determine status and score
    const attempts = await TestAttempt.find({ studentId }).lean();
    const results = await TestResult.find({ studentId }).lean();

    const formattedTests = tests.map(test => {
      const result = results.find(r => r.testId.toString() === test._id.toString());
      const attempt = attempts.find(a => a.testId.toString() === test._id.toString());
      
      let status = 'Pending';
      let score = null;
      let percentile = null;

      if (result) {
        status = 'Completed';
        score = `${result.score}/${result.totalMarks}`;
        percentile = result.percentile ? `${result.percentile}th` : 'N/A';
      } else if (attempt && !attempt.isSubmitted) {
        status = 'In Progress';
      }

      return {
        id: test._id,
        title: test.title,
        subject: test.description || 'General',
        questions: test.questions?.length || 0,
        duration: `${test.durationMinutes} Mins`,
        score,
        status,
        percentile,
        isPremium: test.settings?.isPremium || false
      };
    });

    res.json({ success: true, tests: formattedTests });
  } catch (error) {
    console.error('List tests error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get result by testId
exports.getTestResult = async (req, res) => {
  try {
    const { testId } = req.params;
    const studentId = req.user._id;

    const result = await TestResult.findOne({ testId, studentId })
      .populate('testId', 'title description totalMarks')
      .populate({
        path: 'attemptId',
        populate: { path: 'answers.questionId' }
      });

    if (!result) return res.status(404).json({ message: 'Result not found' });

    // Format data for ResultDashboard
    const report = {
      testTitle: result.testId.title,
      score: result.score,
      totalMarks: result.totalMarks,
      percentile: result.percentile,
      detailedAnalysis: result.detailedAnalysis,
      subjectBreakdown: result.subjectBreakdown,
      answers: result.attemptId.answers
    };

    res.json({ success: true, result: report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Start an exam session (or resume an active one)
exports.startOrResumeAttempt = async (req, res) => {
  try {
    const { testId } = req.params;
    const studentId = req.user._id;

    // Check for an existing unsubmitted attempt
    let activeAttempt = await TestAttempt.findOne({ testId, studentId, isSubmitted: false });
    const test = await Test.findById(testId).populate('questions', '-options.isCorrect -correctExplanation -numericalAnswer');

    if (!test) return res.status(404).json({ message: 'Test not found' });

    if (!activeAttempt) {
      // Create new attempt
      const endTime = new Date(Date.now() + test.durationMinutes * 60000);
      
      const initialAnswers = test.questions.map(q => ({
        questionId: q._id,
        status: 'not_visited',
        timeSpentSeconds: 0
      }));

      activeAttempt = await TestAttempt.create({
        testId,
        studentId,
        startTime: Date.now(),
        endTime,
        answers: initialAnswers
      });
    }

    // Return the sanitized test configuration and the attempt ID
    res.status(200).json({
      attemptId: activeAttempt._id,
      test,
      endTime: activeAttempt.endTime,
      savedState: activeAttempt.answers // for UI restoration
    });

  } catch (error) {
    console.error('Error starting attempt:', error);
    res.status(500).json({ message: 'Failed to start exam.' });
  }
};

// Debounced Auto-Save Heartbeat
exports.autoSaveAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { answers, warnings } = req.body;
    
    // Using atomic updates for speed
    const attempt = await TestAttempt.findOneAndUpdate(
      { _id: attemptId, studentId: req.user._id, isSubmitted: false },
      { 
        $set: { answers, autoSavedAt: Date.now() },
        $push: { warnings: { $each: warnings || [] } }
      },
      { new: true }
    );

    if (!attempt) return res.status(403).json({ message: 'Attempt locked or invalid.' });
    
    res.status(200).json({ message: 'Auto-saved successfully' });
  } catch (error) {
    console.error('Error in auto-save:', error);
    res.status(500).json({ message: 'Auto-save failed.' });
  }
};

// Final Submission & Result Engine Calculation
exports.submitAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;
    
    // 1. Lock the attempt
    const attempt = await TestAttempt.findOneAndUpdate(
      { _id: attemptId, studentId: req.user._id, isSubmitted: false },
      { $set: { isSubmitted: true, autoSavedAt: Date.now() } },
      { new: true }
    );

    if (!attempt) return res.status(400).json({ message: 'Test already submitted or invalid.' });

    // 2. Fetch the definitively correct Questions (with secure fields)
    const test = await Test.findById(attempt.testId).populate('questions');
    let totalCorrect = 0;
    let totalIncorrect = 0;
    let totalUnanswered = 0;
    let score = 0;
    
    const topicAnalysisMap = new Map();

    // 3. Engine Calculation Loop
    for (const ans of attempt.answers) {
      const question = test.questions.find(q => q._id.toString() === ans.questionId.toString());
      if (!question) continue;

      // Track topics
      if (question.topic) {
        if (!topicAnalysisMap.has(question.topic)) {
          topicAnalysisMap.set(question.topic, { correct: 0, total: 0, timeSpent: 0 });
        }
        const tData = topicAnalysisMap.get(question.topic);
        tData.total += 1;
        tData.timeSpent += ans.timeSpentSeconds;
      }

      if (ans.status === 'not_visited' || ans.status === 'visited_unanswered') {
        totalUnanswered += 1;
        continue;
      }

      let isAnswerCorrect = false;

      // Type-specific grading logic
      if (question.type === 'single_mcq' || question.type === 'true_false') {
        const correctOption = question.options.find(o => o.isCorrect);
        if (correctOption && ans.selectedOptionIds && ans.selectedOptionIds.includes(correctOption._id.toString())) {
          isAnswerCorrect = true;
        }
      } else if (question.type === 'multi_mcq') {
        const correctOptions = question.options.filter(o => o.isCorrect).map(o => o._id.toString());
        const selected = ans.selectedOptionIds || [];
        // Strict matching: selected all correct options and NO incorrect options
        if (correctOptions.length === selected.length && correctOptions.every(id => selected.includes(id))) {
          isAnswerCorrect = true;
        }
      } else if (question.type === 'numerical') {
        // Tolerance check
        if (ans.numericalValue >= (question.numericalAnswer - question.numericalTolerance) &&
            ans.numericalValue <= (question.numericalAnswer + question.numericalTolerance)) {
          isAnswerCorrect = true;
        }
      }

      if (isAnswerCorrect) {
        totalCorrect += 1;
        score += question.marks.positive;
        if (question.topic) topicAnalysisMap.get(question.topic).correct += 1;
      } else {
        totalIncorrect += 1;
        score -= question.marks.negative;
      }
    }

    const accuracyPercentage = (totalCorrect / test.questions.length) * 100;

    const topicAnalysis = Array.from(topicAnalysisMap.entries()).map(([topic, data]) => ({
      topic,
      accuracy: data.total > 0 ? (data.correct / data.total) * 100 : 0,
      timeSpent: data.timeSpent,
      totalQuestions: data.total,
      correctQuestions: data.correct
    }));

    // 4. Generate Result Document
    const result = await TestResult.create({
      attemptId: attempt._id,
      testId: test._id,
      studentId: req.user._id,
      score,
      totalCorrect,
      totalIncorrect,
      totalUnanswered,
      accuracyPercentage,
      topicAnalysis
    });

    // Evaluate Certificate Eligibility asynchronously
    if (test.courseId) {
      CredentialEngine.evaluate(req.user._id, test.courseId).catch(err => console.error('Credential Check Error:', err));
    }

    res.status(200).json({ message: 'Test submitted successfully', resultId: result._id });
  } catch (error) {
    console.error('Error calculating result:', error);
    res.status(500).json({ message: 'Submission failed.' });
  }
};

// Fetch Final Result Dashboard Data
exports.getAttemptResult = async (req, res) => {
  try {
    const { attemptId } = req.params;
    
    // Fetch result and populate Test/Attempt details
    const result = await TestResult.findOne({ attemptId, studentId: req.user._id })
      .populate('testId', 'title totalMarks durationMinutes')
      .populate({
        path: 'attemptId',
        select: 'startTime endTime isSubmitted answers',
        populate: {
          path: 'answers.questionId',
          select: 'title content type options correctExplanation topic'
        }
      });
      
    if (!result) return res.status(404).json({ message: 'Result not found or not authorized.' });

    // In a real app, calculate percentile dynamically here using aggregation
    // For now, we return the base result document
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching result:', error);
    res.status(500).json({ message: 'Failed to load result dashboard.' });
  }
};
