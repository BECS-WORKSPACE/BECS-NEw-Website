const mongoose = require('mongoose');

const userAnalyticsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  
  // Streak System
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActiveDate: { type: Date }, // Used to calculate streaks (reset at midnight)

  // Overall Statistics
  totalWatchTimeSeconds: { type: Number, default: 0 },
  lessonsCompleted: { type: Number, default: 0 },
  certificatesEarned: { type: Number, default: 0 },
  
  // Daily activity log (e.g. Map of "YYYY-MM-DD" to seconds watched)
  dailyStats: {
    type: Map,
    of: Number,
    default: {}
  },
  // Gamification & Badges
  xpEarned: { type: Number, default: 0 },
  badges: [{
    badgeId: { type: String },
    unlockedAt: { type: Date, default: Date.now }
  }],
  dailyGoalMinutes: { type: Number, default: 60 }
}, { timestamps: true });

module.exports = mongoose.model('UserAnalytics', userAnalyticsSchema);
