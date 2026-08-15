const NotificationPreference = require('../models/NotificationPreference');
const NotificationTemplate = require('../models/NotificationTemplate');
const emailProvider = require('./providers/EmailProvider');
const inAppProvider = require('./providers/InAppProvider');
const User = require('../models/User');

class NotificationService {
  /**
   * Central orchestrator for firing notifications across all channels
   * @param {Object} eventPayload { userId, topic, templateName, variables, metadata }
   * topic: e.g., 'payments', 'courseUpdates'
   */
  async notify({ userId, topic, templateName, variables, metadata }) {
    try {
      // 1. Fetch User and Preferences
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      // Get or create default preferences
      let prefs = await NotificationPreference.findOne({ user: userId });
      if (!prefs) {
        prefs = await NotificationPreference.create({ user: userId });
      }

      // Check if topic is globally opted out by this user
      if (prefs.topics[topic] === false) {
        console.log(`User ${userId} opted out of topic: ${topic}. Aborting notification.`);
        return;
      }

      // 2. Fetch Template
      // In a real robust system, templates are cached in Redis
      const template = await NotificationTemplate.findOne({ name: templateName, isActive: true });
      if (!template) {
        console.warn(`Template ${templateName} not found or inactive. Falling back to raw metadata if provided.`);
      }

      // 3. Compile Content (Basic string replacement)
      const compile = (str) => {
        if (!str) return '';
        return str.replace(/{{(.*?)}}/g, (match, key) => variables[key.trim()] || '');
      };

      const title = template ? compile(template.subject) : metadata?.title || 'Notification';
      const message = template ? compile(template.bodyText) : metadata?.message || '';
      const html = template ? compile(template.bodyHtml) : `<p>${message}</p>`;

      // 4. Dispatch to Allowed Channels
      const dispatches = [];

      // Email Dispatch
      if (prefs.channels.email && (!template || template.supportedChannels.includes('email'))) {
        // Queueing happens inside or before the provider in production (e.g. BullMQ)
        // For architectural setup, we push directly to provider asynchronously
        dispatches.push(
          emailProvider.send({
            to: user.email,
            subject: title,
            text: message,
            html: html
          }).catch(err => console.error('Email Dispatch Error', err))
        );
      }

      // In-App Dispatch
      if (prefs.channels.inApp && (!template || template.supportedChannels.includes('in_app'))) {
        dispatches.push(
          inAppProvider.send({
            user: userId,
            type: metadata?.type || 'system',
            priority: metadata?.priority || 'normal',
            title: title,
            message: message,
            actionText: template?.ctaText || metadata?.actionText,
            actionLink: template ? compile(template.ctaUrlTemplate) : metadata?.actionLink,
            metadata: variables
          }).catch(err => console.error('InApp Dispatch Error', err))
        );
      }

      // Wait for all dispatches to queue/execute
      await Promise.allSettled(dispatches);
      console.log(`Successfully orchestrated notifications for ${userId} [Topic: ${topic}]`);

    } catch (error) {
      console.error('NotificationService Error:', error.message);
    }
  }
}

module.exports = new NotificationService();
