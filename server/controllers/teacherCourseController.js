const Course = require('../models/Course');
const TeacherActivity = require('../models/TeacherActivity');

// Ensure teacher is authorized to modify the course
const verifyCourseAccess = async (courseId, teacherId, role) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error('Course not found');
  
  // Admins bypass
  if (['admin', 'Admin', 'Super Admin'].includes(role)) return course;

  const isAssigned = course.faculty?.toString() === teacherId.toString() || 
                     course.assignedTeachers?.some(id => id.toString() === teacherId.toString());
                     
  if (!isAssigned) throw new Error('Unauthorized');
  return course;
};

exports.getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      $or: [
        { faculty: req.user._id },
        { assignedTeachers: req.user._id }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
};

exports.updateCourseDraft = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verify sandboxed access
    await verifyCourseAccess(id, req.user._id, req.user.role);

    // Filter out sensitive fields teachers shouldn't update directly (like originalPrice) unless they are admin
    const { title, description, syllabus } = req.body;
    
    const updatedCourse = await Course.findByIdAndUpdate(id, {
      title,
      description,
      syllabus,
      // Do not change status to 'published' here. Keep it draft/published as it was, 
      // or implement a specific "Submit for Approval" workflow.
    }, { new: true });

    // Audit Log
    await TeacherActivity.create({
      teacherId: req.user._id,
      action: 'UPDATED_COURSE',
      targetId: id,
      targetModel: 'Course'
    });

    res.status(200).json(updatedCourse);
  } catch (err) {
    if (err.message === 'Unauthorized') return res.status(403).json({ message: 'Not authorized to edit this course' });
    res.status(500).json({ message: 'Failed to update course' });
  }
};
