const nodemailer = require('nodemailer');

class EmailProvider {
  constructor() {
    // In production, this would use process.env.SMTP_HOST etc. or an API like Resend/SendGrid
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER || 'dummy_user',
        pass: process.env.SMTP_PASS || 'dummy_pass'
      }
    });
  }

  /**
   * Send an email
   * @param {Object} payload { to, subject, html, text }
   */
  async send(payload) {
    try {
      if (!payload.to) throw new Error('Recipient email is required');

      const mailOptions = {
        from: process.env.EMAIL_FROM || '"EduVerse" <noreply@eduverse.com>',
        to: payload.to,
        subject: payload.subject,
        text: payload.text,
        html: payload.html
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${payload.to}. MessageId: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`Failed to send email to ${payload.to}:`, error.message);
      // Depending on retry strategy, we might throw here so the Queue worker retries
      throw error;
    }
  }
}

module.exports = new EmailProvider();
