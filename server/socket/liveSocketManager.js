const jwt = require('jsonwebtoken');
const User = require('../models/User');
const LiveSession = require('../models/LiveSession');
const LiveAttendance = require('../models/LiveAttendance');
const LiveClass = require('../models/LiveClass');
const LiveDoubt = require('../models/LiveDoubt');

module.exports = (io) => {
  const liveNamespace = io.of('/live');

  liveNamespace.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      if (!token) return next(new Error('Authentication error: No token provided'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      const user = await User.findById(decoded.id).select('_id name email role legacyRole isAdmin');
      
      if (!user) return next(new Error('Authentication error: User not found'));
      
      socket.user = user;
      next();
    } catch (err) {
      console.error('Socket Auth Error:', err);
      next(new Error('Authentication error'));
    }
  });

  liveNamespace.on('connection', (socket) => {
    socket.on('JOIN_CLASS', async ({ classId }) => {
      socket.join(classId);
      
      try {
        const isTeacher = socket.user.isAdmin || socket.user.legacyRole === 'teacher';
        
        if (!isTeacher) {
          await LiveAttendance.findOneAndUpdate(
            { liveClassId: classId, studentId: socket.user._id },
            { 
              $push: { sessions: { joinTime: new Date() } },
              $setOnInsert: { status: 'pending' } 
            },
            { upsert: true, new: true }
          );
        } else {
          await LiveClass.findByIdAndUpdate(classId, { status: 'live' });
          await LiveSession.findOneAndUpdate(
            { liveClassId: classId },
            { 
              $setOnInsert: { providerRoomId: `EduVerse_Class_${classId}`, isActive: true, actualStartTime: new Date() }
            },
            { upsert: true }
          );
        }

        socket.to(classId).emit('USER_JOINED', { 
          userId: socket.user._id, 
          name: socket.user.name, 
          isTeacher 
        });

        // Send existing doubts to the joining user
        const existingDoubts = await LiveDoubt.find({ liveClassId: classId }).sort({ createdAt: 1 });
        socket.emit('SYNC_DOUBTS', existingDoubts);

      } catch (err) {
        console.error('Error handling JOIN_CLASS:', err);
      }
    });

    socket.on('LEAVE_CLASS', async ({ classId }) => {
      socket.leave(classId);
      
      try {
        const isTeacher = socket.user.isAdmin || socket.user.legacyRole === 'teacher';
        
        if (!isTeacher) {
          const attendance = await LiveAttendance.findOne({ liveClassId: classId, studentId: socket.user._id });
          if (attendance && attendance.sessions.length > 0) {
            const lastSession = attendance.sessions[attendance.sessions.length - 1];
            if (!lastSession.leaveTime) {
              lastSession.leaveTime = new Date();
              await attendance.save();
            }
          }
        }
        socket.to(classId).emit('USER_LEFT', { 
          userId: socket.user._id, 
          name: socket.user.name 
        });
      } catch (err) {
        console.error('Error handling LEAVE_CLASS:', err);
      }
    });

    socket.on('END_CLASS', async ({ classId }) => {
      try {
        const isTeacher = socket.user.isAdmin || socket.user.legacyRole === 'teacher';
        if (!isTeacher) return;

        liveNamespace.to(classId).emit('CLASS_ENDED', { message: 'The instructor has ended the class.' });

        await LiveClass.findByIdAndUpdate(classId, { status: 'completed' });
        await LiveSession.findOneAndUpdate({ liveClassId: classId }, { isActive: false, actualEndTime: new Date() });
      } catch (err) {
        console.error('Error ending class:', err);
      }
    });

    // Real-Time Doubts Engine
    socket.on('ASK_DOUBT', async ({ classId, question }) => {
      try {
        const doubt = await LiveDoubt.create({
          liveClassId: classId,
          studentId: socket.user._id,
          studentName: socket.user.name,
          question: question
        });
        
        liveNamespace.to(classId).emit('NEW_DOUBT', doubt);
      } catch (err) {
        console.error('Error saving doubt:', err);
      }
    });

    socket.on('RESOLVE_DOUBT', async ({ classId, doubtId }) => {
      try {
        const isTeacher = socket.user.isAdmin || socket.user.legacyRole === 'teacher';
        if (!isTeacher) return;

        const updated = await LiveDoubt.findByIdAndUpdate(
          doubtId, 
          { isResolved: true, resolvedAt: new Date() },
          { new: true }
        );
        
        liveNamespace.to(classId).emit('DOUBT_RESOLVED', updated);
      } catch (err) {
        console.error('Error resolving doubt:', err);
      }
    });
  });
};
