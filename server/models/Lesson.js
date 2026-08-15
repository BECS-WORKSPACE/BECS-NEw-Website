const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['video', 'live', 'pdf', 'quiz', 'assignment', 'document', 'external'], default: 'video' },
  videoUrl: { type: String },
  subtitles: [{
    language: { type: String },
    url: { type: String } // WebVTT file URL
  }],
  duration: { type: Number }, // legacy: in minutes
  durationSeconds: { type: Number }, // v2 precise duration
  isDownloadable: { type: Boolean, default: false },
  order: { type: Number, required: true },
  isFreePreview: { type: Boolean, default: false },
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  resources: [{
    title: { type: String },
    url: { type: String },
    type: { type: String, enum: ['pdf', 'zip', 'link', 'other'] }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);
