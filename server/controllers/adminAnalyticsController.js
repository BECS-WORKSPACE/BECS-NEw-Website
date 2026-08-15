const VideoProgress = require('../models/VideoProgress');
const Course = require('../models/Course');
const User = require('../models/User');

exports.getVideoAnalyticsOverview = async (req, res) => {
  try {
    // Basic aggregation for dashboard KPIs
    const totalWatchedRecords = await VideoProgress.countDocuments();
    
    const completedLessons = await VideoProgress.countDocuments({ isCompleted: true });
    
    // Sum total watch time across all students
    const watchTimeResult = await VideoProgress.aggregate([
      { $group: { _id: null, totalSeconds: { $sum: "$lastWatchedTimestamp" } } }
    ]);
    const totalWatchTimeHours = watchTimeResult.length > 0 ? (watchTimeResult[0].totalSeconds / 3600).toFixed(1) : 0;

    // Top 5 Most Watched Lessons
    const topLessons = await VideoProgress.aggregate([
      { $group: { _id: "$lessonId", views: { $sum: 1 }, avgCompletion: { $avg: "$highestWatchedPercentage" } } },
      { $sort: { views: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'lessons', localField: '_id', foreignField: '_id', as: 'lessonDetails' } },
      { $unwind: "$lessonDetails" },
      { $project: { title: "$lessonDetails.title", views: 1, avgCompletion: { $round: ["$avgCompletion", 1] } } }
    ]);

    res.status(200).json({
      kpis: {
        totalViews: totalWatchedRecords,
        completedLessons,
        totalWatchTimeHours,
        averageCompletionRate: topLessons.length > 0 ? (topLessons.reduce((acc, curr) => acc + curr.avgCompletion, 0) / topLessons.length).toFixed(1) : 0
      },
      topLessons
    });
  } catch (error) {
    console.error('Error fetching admin video analytics:', error);
    res.status(500).json({ message: 'Failed to fetch video analytics' });
  }
};

// Course-specific analytics
exports.getCourseVideoAnalytics = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Drop-off analysis: Average completion percentage per lesson in this course
    const dropOffData = await VideoProgress.aggregate([
      { $match: { courseId: require('mongoose').Types.ObjectId(courseId) } },
      { $group: { _id: "$lessonId", avgCompletion: { $avg: "$highestWatchedPercentage" }, totalStudents: { $sum: 1 } } },
      { $lookup: { from: 'lessons', localField: '_id', foreignField: '_id', as: 'lesson' } },
      { $unwind: "$lesson" },
      { $sort: { "lesson.order": 1 } },
      { $project: { lessonName: "$lesson.title", avgCompletion: { $round: ["$avgCompletion", 1] }, totalStudents: 1 } }
    ]);

    res.status(200).json({ dropOffData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch course analytics' });
  }
};
