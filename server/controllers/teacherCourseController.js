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

const Enrollment = require('../models/Enrollment');

exports.getStudents = async (req, res) => {
  try {
    const { courseId } = req.query;
    let courseIds = [];
    
    if (courseId) {
      await verifyCourseAccess(courseId, req.user._id, req.user.role);
      courseIds.push(courseId);
    } else {
      const courses = await Course.find({
        $or: [
          { faculty: req.user._id },
          { assignedTeachers: req.user._id }
        ]
      }).select('_id');
      courseIds = courses.map(c => c._id);
    }

    const students = await Enrollment.find({ courseId: { $in: courseIds } })
      .populate('user', 'name email profileImage')
      .populate('course', 'title');

    // Aggregate progress
    const enrichedStudents = students.map(enr => {
      // Assuming Enrollment or LearningProgress tracks progress
      return {
        ...enr.toObject(),
        progressPercentage: enr.progress || 0 // Fallback if progress not on model directly
      };
    });

    res.status(200).json(enrichedStudents);
  } catch (err) {
    if (err.message === 'Unauthorized') return res.status(403).json({ message: err.message });
    res.status(500).json({ message: 'Failed to fetch students' });
  }
};

const LibraryResource = require('../models/LibraryResource');

exports.getMaterials = async (req, res) => {
  try {
    const { courseId } = req.query;
    let courseIds = [];
    
    if (courseId) {
      await verifyCourseAccess(courseId, req.user._id, req.user.role);
      courseIds.push(courseId);
    } else {
      const courses = await Course.find({
        $or: [
          { faculty: req.user._id },
          { assignedTeachers: req.user._id }
        ]
      }).select('_id');
      courseIds = courses.map(c => c._id);
    }

    const materials = await LibraryResource.find({ courseId: { $in: courseIds } })
      .populate('courseId', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json(materials);
  } catch (err) {
    if (err.message === 'Unauthorized') return res.status(403).json({ message: err.message });
    res.status(500).json({ message: 'Failed to fetch materials' });
  }
};

const Batch = require('../models/Batch');

exports.getBatches = async (req, res) => {
  try {
    const { courseId } = req.query;
    let courseIds = [];
    
    if (courseId) {
      await verifyCourseAccess(courseId, req.user._id, req.user.role);
      courseIds.push(courseId);
    } else {
      const courses = await Course.find({
        $or: [
          { faculty: req.user._id },
          { assignedTeachers: req.user._id }
        ]
      }).select('_id');
      courseIds = courses.map(c => c._id);
    }

    const batches = await Batch.find({ course: { $in: courseIds } })
      .populate('course', 'title');

    res.status(200).json(batches);
  } catch (err) {
    if (err.message === 'Unauthorized') return res.status(403).json({ message: err.message });
    res.status(500).json({ message: 'Failed to fetch batches' });
  }
};

exports.createBatch = async (req, res) => {
  try {
    const { name, courseId, maxStudents, startDate, endDate } = req.body;
    await verifyCourseAccess(courseId, req.user._id, req.user.role);
    
    const batch = await Batch.create({
      name, course: courseId, maxStudents, startDate, endDate, status: 'active', teachers: [req.user._id]
    });
    
    res.status(201).json(batch);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create batch' });
  }
};

const Attendance = require('../models/Attendance');

exports.getAttendance = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find({ teacherId: req.user._id })
      .populate('courseId', 'title')
      .populate('batchId', 'name')
      .populate('records.studentId', 'name email')
      .sort({ date: -1 });
    res.status(200).json(attendanceRecords);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch attendance' });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { courseId, batchId, date, type, topic, records } = req.body;
    await verifyCourseAccess(courseId, req.user._id, req.user.role);

    const attendance = await Attendance.create({
      courseId, batchId, date, type, topic, records, teacherId: req.user._id
    });
    
    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark attendance' });
  }
};

const MentorshipSession = require('../models/MentorshipSession');

exports.getMentorshipSessions = async (req, res) => {
  try {
    const sessions = await MentorshipSession.find({ teacherId: req.user._id })
      .populate('studentId', 'name email')
      .populate('courseId', 'title')
      .sort({ scheduledAt: 1 });
    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch mentorship sessions' });
  }
};

exports.createMentorshipSlot = async (req, res) => {
  try {
    const { title, description, scheduledAt, durationMinutes, meetingLink, courseId } = req.body;
    
    if (courseId) {
      await verifyCourseAccess(courseId, req.user._id, req.user.role);
    }
    
    const session = await MentorshipSession.create({
      teacherId: req.user._id,
      title, description, scheduledAt, durationMinutes, meetingLink, courseId,
      status: 'available'
    });
    
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create mentorship slot' });
  }
};

exports.updateMentorshipStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, meetingLink } = req.body;
    
    const update = { status };
    if (meetingLink) update.meetingLink = meetingLink;
    
    const session = await MentorshipSession.findOneAndUpdate(
      { _id: id, teacherId: req.user._id },
      update,
      { new: true }
    );
    
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.status(200).json(session);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update session' });
  }
};

const Announcement = require('../models/Announcement');

exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ teacherId: req.user._id })
      .populate('courseId', 'title')
      .populate('batchId', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(announcements);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch announcements' });
  }
};

exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, courseId, batchId, priority } = req.body;
    
    if (courseId) {
      await verifyCourseAccess(courseId, req.user._id, req.user.role);
    }
    
    const announcement = await Announcement.create({
      title, content, courseId, batchId, priority, teacherId: req.user._id
    });
    
    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create announcement' });
  }
};
