const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Subscription = require('../models/Subscription');

exports.getOverviewStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const activeCourses = await Course.countDocuments({ status: 'published' });
    const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });
    const enrolledStudents = await Enrollment.countDocuments({ status: 'active' });

    // Aggregate monthly revenue (mock computation for demo, use aggregation in prod)
    
    // Aggregate MRR
    const subAgg = await Subscription.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const mrr = subAgg.length > 0 ? subAgg[0].total : 0;

    
    // Aggregate Enrollment Revenue
    const enrAgg = await Enrollment.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, total: { $sum: "$pricePaid" } } }
    ]);
    const enrollmentRevenue = enrAgg.length > 0 ? enrAgg[0].total : 0;

    const totalRevenue = mrr + enrollmentRevenue;

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalTeachers,
        activeCourses,
        activeSubscriptions,
        enrolledStudents,
        mrr,
        enrollmentRevenue,
        totalRevenue,
        recentActivity: [
          { message: 'New student enrolled in JEE Advance', time: '10 mins ago' },
          { message: 'Payment failed for Subscription #1029', time: '1 hr ago' },
          { message: 'Teacher published Physics Chapter 4', time: '2 hrs ago' }
        ]
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error fetching admin stats' });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: teachers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getPendingContent = async (req, res) => {
  try {
    const Lesson = require('../models/Lesson');
    const Course = require('../models/Course');
    
    // Fetch draft lessons and populate course
    const lessons = await Lesson.find({ status: 'draft' })
      .populate({ path: 'course', select: 'title faculty facultyName assignedTeachers' })
      .sort({ createdAt: -1 })
      .lean();
      
    const mapped = lessons.map(l => ({
      _id: l._id,
      type: l.type,
      title: l.title,
      course: l.course?.title || 'Unknown',
      teacher: l.course?.facultyName || 'Unassigned',
      status: l.status,
      submittedAt: l.createdAt
    }));
      
    res.status(200).json({ success: true, data: mapped });
  } catch (error) {
    console.error('Error in getPendingContent:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getEnrollments = async (req, res) => {
  try {
    const Enrollment = require('../models/Enrollment');
    const enrollments = await Enrollment.find()
      .populate('user', 'name email')
      .populate('course', 'title')
      .sort({ createdAt: -1 })
      .lean();
      
    const mapped = enrollments.map(e => ({
      _id: e._id,
      student: e.user?.name || 'Unknown',
      course: e.course?.title || 'Unknown',
      amount: e.pricePaid || 0,
      date: new Date(e.createdAt).toLocaleDateString(),
      status: e.status
    }));
      
    res.status(200).json({ success: true, data: mapped });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getSubscriptions = async (req, res) => {
  try {
    const Subscription = require('../models/Subscription');
    const subs = await Subscription.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .lean();
      
    const mapped = subs.map(s => ({
      _id: s._id,
      student: s.user?.name || 'Unknown',
      plan: s.planType || 'Standard',
      amount: s.amount || 0,
      nextBilling: s.nextBillingDate ? new Date(s.nextBillingDate).toLocaleDateString() : 'N/A',
      status: s.status
    }));
      
    res.status(200).json({ success: true, data: mapped });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const Order = require('../models/Order');
    const orders = await Order.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .lean();
      
    const mapped = orders.map(o => ({
      _id: o.razorpay_payment_id || o._id,
      student: o.user?.name || 'Unknown',
      amount: o.amount || 0,
      method: 'Razorpay',
      date: new Date(o.createdAt).toLocaleString(),
      status: o.status === 'success' ? 'captured' : 'failed'
    }));
      
    res.status(200).json({ success: true, data: mapped });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getLearningAnalytics = async (req, res) => {
  try {
    const CourseProgress = require('../models/CourseProgress');
    const TestResult = require('../models/TestResult');
    
    const progressCount = await CourseProgress.countDocuments();
    const testCount = await TestResult.countDocuments();
    
    res.status(200).json({ success: true, data: { progressCount, testCount } });
  } catch (error) {
    console.error('Error fetching learning analytics:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getScholarships = async (req, res) => {
  try {
    const ScholarshipTest = require('../models/ScholarshipTest');
    const tests = await ScholarshipTest.find().sort({ createdAt: -1 }).lean();
      
    const mapped = tests.map(t => ({
      _id: t._id,
      title: t.title,
      questionsCount: t.questions?.length || 0,
      createdAt: new Date(t.createdAt).toLocaleDateString()
    }));
      
    res.status(200).json({ success: true, data: mapped });
  } catch (error) {
    console.error('Error fetching scholarships:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.getCourses = async (req, res) => {
  try {
    const Course = require('../models/Course');
    const courses = await Course.find().select('_id title category level').lean();
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.assignCoursesToTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { courseIds } = req.body;
    
    const User = require('../models/User');
    const Course = require('../models/Course');

    const teacher = await User.findById(teacherId);
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });

    // Remove teacher from previously assigned courses
    if (teacher.assignedCourses && teacher.assignedCourses.length > 0) {
      await Course.updateMany(
        { _id: { $in: teacher.assignedCourses } },
        { $pull: { assignedTeachers: teacher._id } }
      );
    }

    // Assign to new courses
    teacher.assignedCourses = courseIds;
    await teacher.save();

    if (courseIds && courseIds.length > 0) {
      await Course.updateMany(
        { _id: { $in: courseIds } },
        { $addToSet: { assignedTeachers: teacher._id } }
      );
    }

    res.status(200).json({ success: true, message: 'Courses assigned successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getTeacherAssignedCourses = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const User = require('../models/User');
    const teacher = await User.findById(teacherId).populate('assignedCourses', '_id title');
    res.status(200).json({ success: true, data: teacher.assignedCourses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
