const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const LiveClass = require('../models/LiveClass');

exports.getDashboardStats = async (req, res) => {
  try {
    const teacherId = req.user._id;

    // 1. Fetch Assigned Courses
    const courses = await Course.find({ 
      $or: [
        { faculty: teacherId }, 
        { assignedTeachers: teacherId }
      ] 
    }).select('title studentCount rating status');

    const courseIds = courses.map(c => c._id);

    // 2. Fetch Upcoming Live Classes
    const upcomingClasses = await LiveClass.find({
      courseId: { $in: courseIds },
      status: 'scheduled',
      scheduledAt: { $gte: new Date() }
    }).sort({ scheduledAt: 1 }).limit(5);

    // 3. Count Pending Submissions requiring grading
    // Find all assignments linked to these courses
    const assignments = await Assignment.find({ courseId: { $in: courseIds } }).select('_id');
    const assignmentIds = assignments.map(a => a._id);

    const pendingSubmissions = await Submission.countDocuments({
      assignmentId: { $in: assignmentIds },
      status: 'submitted'
    });

    // 4. Calculate Aggregate Stats
    const totalStudents = courses.reduce((acc, curr) => acc + (curr.studentCount || 0), 0);
    
    // In a real app, you would also aggregate unresolved discussions from the Discussion model here

    res.status(200).json({
      overview: {
        activeCourses: courses.length,
        totalStudents,
        pendingSubmissions,
        upcomingClassesCount: upcomingClasses.length
      },
      courses,
      upcomingClasses
    });

  } catch (err) {
    console.error('Error fetching teacher dashboard stats:', err);
    res.status(500).json({ message: 'Failed to load dashboard data' });
  }
};
