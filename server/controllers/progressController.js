const CourseProgress = require('../models/CourseProgress');
const QuestionAttempt = require('../models/QuestionAttempt');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user's overall progress across all courses
    const progressList = await CourseProgress.find({ user: userId });
    
    // Calculate total syllabus completion average
    let averageSyllabusCompletion = 0;
    if (progressList.length > 0) {
      const sum = progressList.reduce((acc, curr) => acc + (curr.syllabusCompletionPercentage || 0), 0);
      averageSyllabusCompletion = Math.round(sum / progressList.length);
    }

    // Fetch question attempts to calculate accuracy and questions solved
    const attempts = await QuestionAttempt.find({ user: userId });
    const questionsSolved = attempts.length;
    let accuracy = 0;
    if (questionsSolved > 0) {
      const correctAnswers = attempts.filter(a => a.isCorrect).length;
      accuracy = Math.round((correctAnswers / questionsSolved) * 100);
    }

    // Exam Readiness: weighted average of syllabus and accuracy (Configurable logic)
    // 60% weight to syllabus completion, 40% weight to practice accuracy
    const examReadiness = Math.round((averageSyllabusCompletion * 0.6) + (accuracy * 0.4));

    // Determine study streak (Assuming streak is stored on the user model for now, else calculate based on attempts)
    const user = await User.findById(userId);
    const streak = user.streak || 0;

    res.json({
      success: true,
      stats: {
        activeCourses: progressList.length,
        syllabusCompletion: averageSyllabusCompletion,
        questionsSolved,
        accuracy,
        examReadiness,
        streak
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving stats' });
  }
};
