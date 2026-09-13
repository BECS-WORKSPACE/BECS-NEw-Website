const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Core Auth
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  
  // RBAC Reference
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
  isAdmin: { type: Boolean, default: false },
  // Keeping this for backward compatibility temporarily, to be phased out
  legacyRole: { type: String, enum: ['student', 'teacher', 'Senior Teacher', 'Course Coordinator', 'Head Faculty', 'admin', 'Super Admin'], default: 'student' },

  // Enterprise Teacher Metadata
  assignedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  teacherProfile: {
    bio: { type: String, default: '' },
    qualifications: [{ type: String }],
    experienceYears: { type: Number, default: 0 },
    specializations: [{ type: String }],
    socialLinks: { 
      linkedin: { type: String, default: '' }, 
      twitter: { type: String, default: '' } 
    }
  },
  permissions: {
    canPublishCourse: { type: Boolean, default: false },
    canModifyGrades: { type: Boolean, default: true },
    canManageAssistants: { type: Boolean, default: false }
  },

  // Onboarding & Enrollment
  profileCompleted: { type: Boolean, default: false },
  enrollmentStatus: { type: String, enum: ['NOT_ENROLLED', 'PAYMENT_PENDING', 'PAYMENT_FAILED', 'ENROLLED', 'SUSPENDED'], default: 'NOT_ENROLLED' },
  preparingFor: { type: String, enum: ['Government Exam Preparation', 'Joint Entrance Preparation', 'Board Exam — Class 10', 'Board Exam — Class 11–12'] },

  // Profile - Basic Info
  name: { type: String, required: true },
  profilePicture: { type: String },
  phone: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
  dob: { type: Date },
  
  // Profile - Address
  address: { type: String },
  city: { type: String },
  state: { type: String },
  district: { type: String },
  pinCode: { type: String },
  country: { type: String, default: 'India' },

  // Profile - Academic/Professional
  highestEducation: { type: String },
  education: { type: String },
  institute: { type: String },
  course: { type: String },
  bio: { type: String, maxlength: 500 },
  skills: [{ type: String }],
  goals: [{ type: String }],
  languages: [{ type: String }],
  socialLinks: {
    linkedin: { type: String },
    github: { type: String },
    twitter: { type: String },
    portfolio: { type: String }
  },

  // Security
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Date },
  lastLogin: { type: Date },
  status: { type: String, enum: ['active', 'suspended', 'banned'], default: 'active' },

  // User Preferences
  preferences: {
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    language: { type: String, default: 'en' },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    }
  },

  // EduVerse Specific Fields (Preserved for compatibility)
  enrolledCourses: [{ type: String }],
  isPremium: { type: Boolean, default: false },
  subscriptionValidUntil: { type: Date },
  scholarshipDiscount: { type: Number, default: 0 },
  
  // Assessment Platform Analytics
  overallRank: { type: Number },
  testPercentile: { type: Number, default: 0 },
  
  // Digital Library Tracking
  libraryBookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LibraryResource' }],
  
  // Communication & Community
  unreadMessagesCount: { type: Number, default: 0 },
  followedDiscussions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Discussion' }],
  reputationPoints: { type: Number, default: 0 },
  
  counsellingBookings: [{
    type: { type: String, enum: ['career', 'psychological'] },
    counsellor: String,
    date: Date,
    status: { type: String, default: 'pending' }
  }]
}, { timestamps: true });

// Virtual for checking if account is currently locked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

module.exports = mongoose.model('User', userSchema);
