const mongoose = require('mongoose');

const certificateTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  type: {
    type: String,
    enum: [
      'course_completion', 'program_completion', 'batch_completion', 
      'test_series', 'achievement', 'participation', 'excellence', 
      'instructor', 'workshop', 'internship', 'custom'
    ],
    required: true
  },
  
  // HTML Structure built with Handlebars syntax (e.g. {{studentName}})
  baseHtml: { type: String, required: true },
  
  // Dynamic Design Elements configured via UI
  designConfig: {
    backgroundUrl: { type: String },
    logoUrl: { type: String },
    primaryColor: { type: String, default: '#000000' },
    secondaryColor: { type: String, default: '#666666' },
    fontFamily: { type: String, default: 'Inter, sans-serif' },
    signatures: [{
      name: String,
      title: String,
      imageUrl: String
    }]
  },

  // Which dynamic variables must be provided when issuing this certificate
  requiredVariables: [{ type: String }], // e.g. ['studentName', 'courseName', 'issueDate', 'qrCode']
  
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('CertificateTemplate', certificateTemplateSchema);
