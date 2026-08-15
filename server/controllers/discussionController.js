const Discussion = require('../models/Discussion');
const DiscussionReply = require('../models/DiscussionReply');
const User = require('../models/User');
const Course = require('../models/Course');

exports.createDiscussion = async (req, res) => {
  try {
    const { title, body, courseId, lessonId, topicTags, isPremium } = req.body;
    const discussion = await Discussion.create({
      title,
      body,
      courseId,
      lessonId,
      topicTags,
      isPremium,
      authorId: req.user._id
    });

    if (courseId) {
      await Course.findByIdAndUpdate(courseId, { $push: { discussions: discussion._id } });
    }

    res.status(201).json(discussion);
  } catch (err) {
    console.error('Error creating discussion:', err);
    res.status(500).json({ message: 'Failed to post doubt' });
  }
};

exports.getDiscussions = async (req, res) => {
  try {
    const { courseId, lessonId, status, page = 1, limit = 20 } = req.query;
    let query = {};

    if (courseId) query.courseId = courseId;
    if (lessonId) query.lessonId = lessonId;
    if (status) query.status = status;

    const discussions = await Discussion.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('authorId', 'name avatar role');

    res.status(200).json(discussions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch discussions' });
  }
};

exports.addReply = async (req, res) => {
  try {
    const { id } = req.params; // discussionId
    const { body } = req.body;
    
    const isTeacher = ['Admin', 'Teacher', 'admin', 'teacher'].includes(req.user.role);

    const reply = await DiscussionReply.create({
      discussionId: id,
      authorId: req.user._id,
      body,
      isTeacherResponse: isTeacher
    });

    // Update reputation for gamification if it's a student helping another student
    if (!isTeacher) {
      await User.findByIdAndUpdate(req.user._id, { $inc: { reputationPoints: 5 } });
    }

    // Optional: Emit websocket event to author of discussion here
    if (global.io) {
      global.io.to(`discussion_${id}`).emit('new_reply', reply);
    }

    res.status(201).json(reply);
  } catch (err) {
    res.status(500).json({ message: 'Failed to post reply' });
  }
};

exports.resolveDiscussion = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyId } = req.body;
    
    const discussion = await Discussion.findById(id);
    if (!discussion) return res.status(404).json({ message: 'Discussion not found' });
    
    // Only Author or Teacher can resolve
    if (discussion.authorId.toString() !== req.user._id.toString() && !['Admin', 'Teacher'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to resolve this discussion' });
    }

    discussion.status = 'resolved';
    discussion.bestReplyId = replyId;
    await discussion.save();

    // Reward the user who provided the best reply
    const bestReply = await DiscussionReply.findById(replyId);
    if (bestReply) {
      await User.findByIdAndUpdate(bestReply.authorId, { $inc: { reputationPoints: 20 } });
    }

    res.status(200).json(discussion);
  } catch (err) {
    res.status(500).json({ message: 'Failed to resolve discussion' });
  }
};
