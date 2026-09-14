const mongoose = require('mongoose');
const dotenv = require('dotenv');
const NotificationTemplate = require('./models/NotificationTemplate');

dotenv.config();

const templates = [
  {
    name: 'welcome_email',
    description: 'Sent when a user completes their profile.',
    subject: 'Welcome to EduVerse, {{name}}!',
    bodyHtml: '<p>Hi {{name}},</p><p>Welcome to EduVerse! We are thrilled to have you.</p><p>Explore your dashboard to start learning.</p>',
    bodyText: 'Hi {{name}}, Welcome to EduVerse! Explore your dashboard to start learning.',
    supportedChannels: ['email', 'in_app'],
    requiredVariables: ['name'],
    isActive: true
  },
  {
    name: 'enrollment_success',
    description: 'Sent when a user successfully enrolls in a course.',
    subject: 'Enrollment Confirmed: {{courseName}}',
    bodyHtml: '<p>Hi {{name}},</p><p>You have successfully enrolled in <strong>{{courseName}}</strong>.</p>',
    bodyText: 'Hi {{name}}, You have successfully enrolled in {{courseName}}.',
    supportedChannels: ['email', 'in_app'],
    requiredVariables: ['name', 'courseName'],
    isActive: true
  },
  {
    name: 'live_class_scheduled',
    description: 'Sent when an instructor schedules a new live class for an enrolled course.',
    subject: 'New Live Class Scheduled: {{classTitle}}',
    bodyHtml: '<p>Hi {{name}},</p><p>A new live class "<strong>{{classTitle}}</strong>" has been scheduled for your course <strong>{{courseName}}</strong> on {{startTime}}.</p>',
    bodyText: 'Hi {{name}}, A new live class "{{classTitle}}" has been scheduled for your course {{courseName}} on {{startTime}}.',
    ctaText: 'View Class',
    ctaUrlTemplate: '/dashboard/live-classes',
    supportedChannels: ['email', 'in_app'],
    requiredVariables: ['name', 'classTitle', 'courseName', 'startTime'],
    isActive: true
  }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/becs')
  .then(async () => {
    console.log('Connected to DB');
    await NotificationTemplate.deleteMany({});
    await NotificationTemplate.insertMany(templates);
    console.log('Templates seeded');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
