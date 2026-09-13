const Subscription = require('../models/Subscription');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Chapter = require('../models/Chapter');
const Lesson = require('../models/Lesson');
const CourseProgress = require('../models/CourseProgress');
const VideoProgress = require('../models/VideoProgress');

// Check access utility
const checkCourseAccess = async (userId, courseId) => {
  // Check active subscription
  const sub = await Subscription.findOne({ user: userId, course: courseId, status: 'active' });
  if (sub) return { access: true, type: 'subscription', data: sub };

  // Check manual enrollment
  const enrollment = await Enrollment.findOne({ user: userId, course: courseId, status: 'active' });
  if (enrollment) return { access: true, type: 'enrollment', data: enrollment };

  return { access: false };
};

exports.getMyCourses = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all active subscriptions and enrollments
    const subscriptions = await Subscription.find({ user: userId }).populate('course');
    const enrollments = await Enrollment.find({ user: userId }).populate('course');

    const courseMap = new Map();

    subscriptions.forEach(sub => {
      if (sub.course) {
        courseMap.set(sub.course._id.toString(), {
          course: sub.course,
          accessType: 'subscription',
          status: sub.status,
          expiryDate: sub.endDate
        });
      }
    });

    enrollments.forEach(enr => {
      if (enr.course && !courseMap.has(enr.course._id.toString())) {
        courseMap.set(enr.course._id.toString(), {
          course: enr.course,
          accessType: 'enrollment',
          status: enr.status,
          expiryDate: enr.endDate // might be null for lifetime
        });
      }
    });

    const coursesArray = Array.from(courseMap.values());

    // Fetch progress for each
    const coursesWithProgress = await Promise.all(coursesArray.map(async (c) => {
      const progress = await CourseProgress.findOne({ user: userId, course: c.course._id });
      // Fetch last accessed lesson logic can be complex, just get highest updated VideoProgress
      const lastAccessed = await VideoProgress.findOne({ user: userId, course: c.course._id })
        .sort('-updatedAt')
        .populate('lesson');

      return {
        ...c,
        progress: progress ? progress.percentage : 0,
        completedVideos: progress ? progress.completedVideos : [],
        lastAccessedLesson: lastAccessed && lastAccessed.lesson ? {
          id: lastAccessed.lesson._id,
          title: lastAccessed.lesson.title,
          chapterId: lastAccessed.lesson.chapterId
        } : null
      };
    }));

    res.json({ success: true, myCourses: coursesWithProgress });
  } catch (err) {
    console.error('Error fetching my courses:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getCourseSyllabus = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: courseId } = req.params;

    // 1. Verify Access
    const access = await checkCourseAccess(userId, courseId);
    
    // 2. Fetch Hierarchy
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const modules = await Module.find({ courseId, status: 'published' }).sort('order');
    const chapters = await Chapter.find({ courseId, status: 'published' }).sort('order');
    const lessons = await Lesson.find({ course: courseId, status: 'published' }).sort('order');

    // Also fetch user progress to mark lessons as completed/locked
    const progress = await CourseProgress.findOne({ user: userId, course: courseId });
    const completedLessonIds = progress ? progress.completedVideos.map(id => id.toString()) : [];

    // Assemble Tree
    const syllabusTree = modules.map(mod => {
      const modChapters = chapters.filter(c => c.moduleId.toString() === mod._id.toString());
      return {
        _id: mod._id,
        title: mod.title,
        order: mod.order,
        chapters: modChapters.map(ch => {
          const chLessons = lessons.filter(l => l.chapterId && l.chapterId.toString() === ch._id.toString());
          return {
            _id: ch._id,
            title: ch.title,
            order: ch.order,
            lessons: chLessons.map(l => ({
              _id: l._id,
              title: l.title,
              type: l.type,
              duration: l.duration,
              isCompleted: completedLessonIds.includes(l._id.toString()),
              // If not accessible, mark as locked. But we verified access, so everything is unlocked unless expired
              isLocked: !access.access || access.status === 'expired'
            }))
          };
        })
      };
    });

    res.json({ 
      success: true, 
      course: { _id: course._id, title: course.title }, 
      syllabus: syllabusTree,
      hasAccess: access.access,
      accessStatus: access.status
    });

  } catch (err) {
    console.error('Error fetching syllabus:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getLessonDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: lessonId } = req.params;

    const lesson = await Lesson.findById(lessonId).populate('course');
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });

    // Verify Access to parent course
    const access = await checkCourseAccess(userId, lesson.course._id);
    if (!access.access || access.status === 'expired') {
      return res.status(403).json({ success: false, message: 'Access denied or subscription expired' });
    }

    // Get current progress for this video to allow resuming
    const videoProgress = await VideoProgress.findOne({ user: userId, lesson: lessonId });

    res.json({
      success: true,
      lesson,
      resumeFromSeconds: videoProgress ? videoProgress.watchedSeconds : 0
    });
  } catch (err) {
    console.error('Error fetching lesson:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateLessonProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: lessonId } = req.params;
    const { watchedSeconds, isCompleted } = req.body;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });

    // 1. Update VideoProgress
    let videoProgress = await VideoProgress.findOne({ user: userId, lesson: lessonId });
    if (!videoProgress) {
      videoProgress = new VideoProgress({
        user: userId,
        course: lesson.course,
        lesson: lessonId,
        watchedSeconds: 0,
        isCompleted: false
      });
    }

    if (watchedSeconds > videoProgress.watchedSeconds) {
      videoProgress.watchedSeconds = watchedSeconds;
    }
    
    // Evaluate auto-completion (e.g. watched > 90% of duration)
    // Assuming duration is in minutes in DB, convert to seconds
    const threshold = lesson.duration ? (lesson.duration * 60 * 0.9) : 0;
    if (isCompleted || (threshold > 0 && watchedSeconds >= threshold)) {
      videoProgress.isCompleted = true;
    }

    await videoProgress.save();

    // 2. Update CourseProgress if lesson just completed
    if (videoProgress.isCompleted) {
      let courseProgress = await CourseProgress.findOne({ user: userId, course: lesson.course });
      if (!courseProgress) {
        courseProgress = new CourseProgress({
          user: userId,
          course: lesson.course,
          completedVideos: []
        });
      }

      if (!courseProgress.completedVideos.includes(lessonId)) {
        courseProgress.completedVideos.push(lessonId);
        
        // Recalculate percentage
        const totalLessons = await Lesson.countDocuments({ course: lesson.course, status: 'published' });
        if (totalLessons > 0) {
          courseProgress.percentage = Math.round((courseProgress.completedVideos.length / totalLessons) * 100);
        }
        await courseProgress.save();
      }
    }

    res.json({ success: true, message: 'Progress saved' });
  } catch (err) {
    console.error('Error updating progress:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
