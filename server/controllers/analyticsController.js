const QuestionAttempt = require('../models/QuestionAttempt');

exports.getPerformanceAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all question attempts
    const attempts = await QuestionAttempt.find({ user: userId }).populate('question');

    // Aggregate data for Topic Performance
    const topicMap = new Map();
    const subjectMap = new Map();

    attempts.forEach(attempt => {
      const q = attempt.question;
      if (!q) return;

      // Topic logic
      const topicName = q.chapter || q.topic || 'General';
      if (!topicMap.has(topicName)) {
        topicMap.set(topicName, { total: 0, correct: 0 });
      }
      const t = topicMap.get(topicName);
      t.total += 1;
      if (attempt.isCorrect) t.correct += 1;

      // Subject logic
      const subjectName = q.subject || 'General';
      if (!subjectMap.has(subjectName)) {
        subjectMap.set(subjectName, { total: 0, correct: 0 });
      }
      const s = subjectMap.get(subjectName);
      s.total += 1;
      if (attempt.isCorrect) s.correct += 1;
    });

    const topicData = Array.from(topicMap.entries()).map(([name, data]) => ({
      name,
      score: Math.round((data.correct / data.total) * 100)
    }));

    const subjectData = Array.from(subjectMap.entries()).map(([subject, data]) => ({
      subject,
      score: Math.round((data.correct / data.total) * 100),
      fullMark: 100
    }));

    // For Score Trend, we would normally use Test Attempts.
    // For now, we can group question attempts by day.
    const trendMap = new Map();
    attempts.forEach(attempt => {
      const date = new Date(attempt.createdAt).toLocaleDateString();
      if (!trendMap.has(date)) {
        trendMap.set(date, { total: 0, correct: 0 });
      }
      const d = trendMap.get(date);
      d.total += 1;
      if (attempt.isCorrect) d.correct += 1;
    });

    const scoreData = Array.from(trendMap.entries()).map(([name, data]) => ({
      name,
      score: Math.round((data.correct / data.total) * 100),
      accuracy: Math.round((data.correct / data.total) * 100)
    }));

    res.json({
      success: true,
      topicData,
      subjectData,
      scoreData
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving analytics' });
  }
};
