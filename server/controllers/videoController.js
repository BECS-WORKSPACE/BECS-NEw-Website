const VideoProgress = require('../models/VideoProgress');
const VideoNote = require('../models/VideoNote');
const WatchHistory = require('../models/WatchHistory');

// 1. Sync Video Progress (Beacon endpoint called every 5-10s)
exports.syncProgress = async (req, res) => {
  try {
    const { courseId, lessonId, currentTimestamp, duration } = req.body;
    const userId = req.user._id;

    if (!courseId || !lessonId || currentTimestamp === undefined) {
      return res.status(400).json({ message: 'Missing required sync data' });
    }

    // Calculate completion percentage
    let percentage = 0;
    if (duration > 0) {
      percentage = (currentTimestamp / duration) * 100;
    }
    
    // Hard check for completion (90% watched)
    const isCompleted = percentage >= 90;

    // Update or Insert VideoProgress using atomic findOneAndUpdate
    const progress = await VideoProgress.findOneAndUpdate(
      { user: userId, lessonId: lessonId },
      {
        $set: {
          courseId,
          lastWatchedTimestamp: currentTimestamp,
          totalDurationSeconds: duration
        },
        // Only update highest watched if the new percentage is actually higher
        $max: { highestWatchedPercentage: percentage },
        // Set completion flag if threshold met, don't revert if already true
        ...(isCompleted && { isCompleted: true, completedAt: new Date() })
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Also bump the global watch history
    await WatchHistory.findOneAndUpdate(
      { user: userId, lessonId: lessonId },
      { $set: { courseId, lastAccessed: new Date() } },
      { upsert: true }
    );

    res.status(200).json(progress);
  } catch (error) {
    console.error('Progress sync error:', error);
    res.status(500).json({ message: 'Failed to sync progress' });
  }
};

// 2. Get Resume Playback Data
exports.getResumeData = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const progress = await VideoProgress.findOne({ user: req.user._id, lessonId });
    
    if (!progress) {
      return res.status(200).json({ lastWatchedTimestamp: 0, isCompleted: false });
    }
    
    res.status(200).json({
      lastWatchedTimestamp: progress.lastWatchedTimestamp,
      highestWatchedPercentage: progress.highestWatchedPercentage,
      isCompleted: progress.isCompleted
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch resume data' });
  }
};

// 3. Create a Timestamped Note
exports.createNote = async (req, res) => {
  try {
    const { courseId, lessonId, timestamp, text, color } = req.body;
    
    const note = await VideoNote.create({
      user: req.user._id,
      courseId,
      lessonId,
      timestamp,
      text,
      color: color || '#fbbf24'
    });
    
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create note' });
  }
};

// 4. Get all Notes for a Lesson
exports.getNotes = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const notes = await VideoNote.find({ user: req.user._id, lessonId }).sort({ timestamp: 1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notes' });
  }
};

// 5. Delete a Note
exports.deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    await VideoNote.findOneAndDelete({ _id: noteId, user: req.user._id });
    res.status(200).json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete note' });
  }
};
