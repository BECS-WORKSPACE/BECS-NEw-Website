const mongoose = require('mongoose');

const libraryResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { 
    type: String, 
    enum: ['pdf', 'ebook', 'notes', 'slides', 'pyq', 'video', 'archive', 'link'],
    required: true
  },
  
  // File Management
  fileUrl: { type: String, required: true },
  fileName: { type: String },
  fileSize: { type: Number }, // In bytes
  mimeType: { type: String },
  
  // Organization
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'LibraryCategory' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // Optional, for global lib vs course lib
  topicTags: [{ type: String }],
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  language: { type: String, default: 'English' },
  
  // Access & Security
  isPremium: { type: Boolean, default: false },
  allowDownload: { type: Boolean, default: true },
  
  // Version Control
  version: { type: String, default: '1.0' },
  previousVersions: [{
    version: String,
    fileUrl: String,
    archivedAt: { type: Date, default: Date.now }
  }],
  
  // Analytics Cache
  viewCount: { type: Number, default: 0 },
  downloadCount: { type: Number, default: 0 },
  
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Text indices for lightning-fast search
libraryResourceSchema.index({ title: 'text', description: 'text', topicTags: 'text' });
libraryResourceSchema.index({ courseId: 1, type: 1 });

module.exports = mongoose.model('LibraryResource', libraryResourceSchema);
