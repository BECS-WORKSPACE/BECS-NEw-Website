const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    enum: ['Guest', 'Student', 'Teacher', 'Mentor', 'Moderator', 'Course Coordinator', 'Head Faculty', 'Admin', 'Super Admin']
  },
  permissions: [{ type: String }],
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);
