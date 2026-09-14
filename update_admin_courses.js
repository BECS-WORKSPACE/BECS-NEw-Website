const fs = require('fs');

// 1. Update adminController.js
let controller = fs.readFileSync('server/controllers/adminController.js', 'utf8');

const newControllerLogic = `
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
`;

controller = controller + '\n' + newControllerLogic;
fs.writeFileSync('server/controllers/adminController.js', controller);

// 2. Update adminRoutes.js
let routes = fs.readFileSync('server/routes/adminRoutes.js', 'utf8');
const newRoutesLogic = `
router.get('/courses', adminController.getCourses);
router.get('/teachers/:teacherId/courses', adminController.getTeacherAssignedCourses);
router.put('/teachers/:teacherId/courses', adminController.assignCoursesToTeacher);
`;
routes = routes.replace('module.exports = router;', newRoutesLogic + '\nmodule.exports = router;');
fs.writeFileSync('server/routes/adminRoutes.js', routes);
