const Notification = require('../../models/Notification');

class InAppProvider {
  /**
   * Deliver an in-app notification by saving it to the database
   * @param {Object} payload { user, type, priority, title, message, actionText, actionLink, metadata }
   */
  async send(payload) {
    try {
      if (!payload.user) throw new Error('User ID is required for in-app notification');

      const notification = await Notification.create({
        user: payload.user,
        type: payload.type || 'system',
        priority: payload.priority || 'normal',
        title: payload.title,
        message: payload.message,
        actionText: payload.actionText,
        actionLink: payload.actionLink,
        metadata: payload.metadata,
        status: 'unread'
      });

      // If we had Socket.io connected globally, we could emit a real-time event here
      if (global.io) {
        global.io.to(payload.user.toString()).emit('new_notification', notification);
      }

      console.log(`In-App Notification created for user ${payload.user}`);
      return { success: true, notificationId: notification._id };
    } catch (error) {
      console.error(`Failed to create in-app notification for ${payload.user}:`, error.message);
      throw error;
    }
  }
}

module.exports = new InAppProvider();
