const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

module.exports = function (io) {
  io.on('connection', (socket) => {
    
    // Join a specific chat room (either 1-1 or a global course batch chat)
    socket.on('join_chat_room', async ({ conversationId, userId }) => {
      socket.join(`chat_${conversationId}`);
      console.log(`User ${userId} joined chat_${conversationId}`);
    });

    // Listen for new messages
    socket.on('send_message', async (data) => {
      try {
        const { conversationId, senderId, body } = data;
        
        // 1. Save to database
        const message = await Message.create({
          conversationId,
          senderId,
          body,
          readBy: [senderId]
        });

        // 2. Update conversation's last message timestamp
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: message._id,
          updatedAt: Date.now()
        });

        // 3. Broadcast to all users in the room instantly
        io.to(`chat_${conversationId}`).emit('receive_message', message);
        
        // 4. (Background) Increment unread count for offline participants
        // In a production app, you'd check active socket sessions here
      } catch (err) {
        console.error('Socket message error:', err);
      }
    });

    // Typing Indicators
    socket.on('typing_start', ({ conversationId, userName }) => {
      socket.to(`chat_${conversationId}`).emit('user_typing', { userName });
    });

    socket.on('typing_stop', ({ conversationId }) => {
      socket.to(`chat_${conversationId}`).emit('user_stopped_typing');
    });

    // Discussion Subscription (For Live Q&A in LMS)
    socket.on('join_discussion', ({ discussionId }) => {
      socket.join(`discussion_${discussionId}`);
    });

  });
};
