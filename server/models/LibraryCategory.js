const mongoose = require('mongoose');

const libraryCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'LibraryCategory', default: null } // Allows nested subcategories
}, { timestamps: true });

module.exports = mongoose.model('LibraryCategory', libraryCategorySchema);
