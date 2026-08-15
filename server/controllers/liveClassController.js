const LiveClass = require('../models/LiveClass');
const Course = require('../models/Course');
const crypto = require('crypto');

// Schedule a new live class
exports.scheduleClass = async (req, res) => {
  try {
    const { title, description, courseId, scheduledStartTime, durationMinutes, settings } = req.body;
    
    // In production, get this from req.user._id (Teacher/Admin)
    const instructorId = req.user._id;

    const newLiveClass = await LiveClass.create({
      title,
      description,
      courseId,
      instructorId,
      scheduledStartTime,
      durationMinutes: durationMinutes || 60,
      settings
    });

    // Optionally push to course liveClasses array
    await Course.findByIdAndUpdate(courseId, {
      $push: { liveClasses: newLiveClass._id }
    });

    res.status(201).json(newLiveClass);
  } catch (error) {
    console.error('Error scheduling live class:', error);
    res.status(500).json({ message: 'Failed to schedule live class' });
  }
};

// Get upcoming classes for a student (based on their enrolled courses)
// For simplicity, we just fetch all for a specific course here
exports.getUpcomingClassesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      // Legacy course IDs like "1" or "2" won't have LiveClasses anyway
      return res.status(200).json([]);
    }
    
    const classes = await LiveClass.find({
      courseId,
      status: { $in: ['scheduled', 'live'] },
      scheduledStartTime: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // don't show old missed classes here
    })
    .populate('instructorId', 'name profilePicture')
    .sort({ scheduledStartTime: 1 });

    res.status(200).json(classes);
  } catch (error) {
    console.error('Error fetching live classes:', error);
    res.status(500).json({ message: 'Failed to fetch live classes' });
  }
};

// Teacher/Admin fetches all their scheduled classes
exports.getInstructorClasses = async (req, res) => {
  try {
    const classes = await LiveClass.find({ instructorId: req.user._id })
      .populate('courseId', 'title')
      .sort({ scheduledStartTime: 1 });
      
    res.status(200).json(classes);
  } catch (error) {
    console.error('Error fetching instructor classes:', error);
    res.status(500).json({ message: 'Failed to fetch instructor classes' });
  }
};

// Webhook for Jitsi/Cloud to ping when recording is processed
exports.handleRecordingWebhook = async (req, res) => {
  try {
    const { classId, recordingUrl, durationSeconds } = req.body;
    
    // In production, validate webhook signature here using a secret key
    
    // 1. Update LiveClass with Recording URL
    const liveClass = await LiveClass.findByIdAndUpdate(
      classId, 
      { recordingUrl },
      { new: true }
    );
    
    if (!liveClass) return res.status(404).json({ message: 'Live class not found' });
    if (!liveClass.courseId) return res.status(200).json({ message: 'No course linked' });

    // 2. Fetch or Create a "Live Recordings" Module in the Course
    const Module = require('../models/Module');
    let recordingModule = await Module.findOne({ courseId: liveClass.courseId, title: 'Live Recordings' });
    
    if (!recordingModule) {
      // Find highest order
      const existingModules = await Module.find({ courseId: liveClass.courseId }).sort({ order: -1 }).limit(1);
      const newOrder = existingModules.length > 0 ? existingModules[0].order + 1 : 1;
      
      recordingModule = await Module.create({
        courseId: liveClass.courseId,
        title: 'Live Recordings',
        description: 'Auto-generated recordings of past live sessions.',
        order: newOrder,
        status: 'published'
      });
      
      // Add module to Course
      await Course.findByIdAndUpdate(liveClass.courseId, { $push: { modules: recordingModule._id } });
    }

    // 3. Create Lesson containing the Video
    const Lesson = require('../models/Lesson');
    const existingLessons = await Lesson.find({ moduleId: recordingModule._id }).sort({ order: -1 }).limit(1);
    const newLessonOrder = existingLessons.length > 0 ? existingLessons[0].order + 1 : 1;
    
    const newLesson = await Lesson.create({
      course: liveClass.courseId,
      moduleId: recordingModule._id,
      title: `${liveClass.title} (Recording)`,
      description: liveClass.description || `Recorded on ${new Date(liveClass.scheduledStartTime).toDateString()}`,
      type: 'video',
      videoUrl: recordingUrl,
      durationSeconds: durationSeconds || 3600,
      order: newLessonOrder,
      status: 'published'
    });
    
    // 4. Attach lesson to Course
    await Course.findByIdAndUpdate(liveClass.courseId, { $push: { lessons: newLesson._id } });

    console.log(`Successfully injected recording for Class ${classId} into Course ${liveClass.courseId}`);
    res.status(200).json({ message: 'Recording processed and added to curriculum' });

  } catch (error) {
    console.error('Error handling recording webhook:', error);
    res.status(500).json({ message: 'Failed to process webhook' });
  }
};
