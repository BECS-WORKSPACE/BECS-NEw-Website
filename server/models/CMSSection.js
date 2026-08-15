const mongoose = require('mongoose');

const cmsSectionSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true, // e.g., 'home', 'about', 'contact'
    index: true
  },
  sectionKey: {
    type: String,
    required: true,
    unique: true // e.g., 'hero_banner', 'featured_courses'
  },
  contentData: {
    type: mongoose.Schema.Types.Mixed,
    required: true // JSON containing title, subtitle, image_url, etc.
  },
  status: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'published'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('CMSSection', cmsSectionSchema);
