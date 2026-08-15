const jwt = require('jsonwebtoken');
const User = require('../models/User');
const LiveSession = require('../models/LiveSession');
const LiveAttendance = require('../models/LiveAttendance');
const LiveClass = require('../models/LiveClass');

module.exports = (io) => {
  // Create a dedicated namespace for live classrooms to avoid collision with standard notifications
  const liveNamespace = io.of('/live');

  // Authenticate socket connection
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
    // console.log(`User connected to /live namespace: ${socket.user.name}`);

    // Join a specific class room
    socket.on('JOIN_CLASS', async ({ classId }) => {
      socket.join(classId);
      // console.log(`${socket.user.name} joined room ${classId}`);
      
      try {
        // Track Attendance (Join Time)
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
          // If Teacher joins, update the Session status to 'live' if not already
          await LiveClass.findByIdAndUpdate(classId, { status: 'live' });
          await LiveSession.findOneAndUpdate(
            { liveClassId: classId },
            { 
              $setOnInsert: { providerRoomId: `EduVerse_Class_${classId}`, isActive: true, actualStartTime: new Date() }
            },
            { upsert: true }
          );
        }

        // Notify room
        socket.to(classId).emit('USER_JOINED', { 
          userId: socket.user._id, 
          name: socket.user.name, 
          isTeacher 
        });

      } catch (err) {
        console.error('Error handling JOIN_CLASS:', err);
      }
    });

    // Leave a specific class room
    socket.on('LEAVE_CLASS', async ({ classId }) => {
      socket.leave(classId);
      
      try {
        const isTeacher = socket.user.isAdmin || socket.user.legacyRole === 'teacher';
        
        if (!isTeacher) {
          // Update the latest session in the array with a leaveTime
          const attendance = await LiveAttendance.findOne({ liveClassId: classId, studentId: socket.user._id });
          if (attendance && attendance.sessions.length > 0) {
            const lastSession = attendance.sessions[attendance.sessions.length - 1];
            if (!lastSession.leaveTime) {
              lastSession.leaveTime = new Date();
              await attendance.save();
            }
          }
        } else {
          // Teacher leaving - optionally auto-end class or keep alive for 2 mins
          // For now, we rely on a hard END_CLASS event for explicit termination.
        }

        socket.to(classId).emit('USER_LEFT', { 
          userId: socket.user._id, 
          name: socket.user.name 
        });
      } catch (err) {
        console.error('Error handling LEAVE_CLASS:', err);
      }
    });

    // End class (Teacher only)
    socket.on('END_CLASS', async ({ classId }) => {
      try {
        const isTeacher = socket.user.isAdmin || socket.user.legacyRole === 'teacher';
        if (!isTeacher) return;

        // Force everyone out
        liveNamespace.to(classId).emit('CLASS_ENDED', { message: 'The instructor has ended the class.' });

        // Update DB
        await LiveClass.findByIdAndUpdate(classId, { status: 'completed' });
        await LiveSession.findOneAndUpdate({ liveClassId: classId }, { isActive: false, actualEndTime: new Date() });

        // A background Cron job or Queue should ideally calculate the final attendance percentages here.
      } catch (err) {
        console.error('Error ending class:', err);
      }
    });

    // Handle Disconnect
    socket.on('disconnect', () => {
      // In a robust system, we would map socket.id to active classIds and trigger LEAVE_CLASS logic
      // console.log(`User disconnected: ${socket.user.name}`);
    });
  });
};
