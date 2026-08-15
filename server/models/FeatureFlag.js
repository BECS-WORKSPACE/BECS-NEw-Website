const mongoose = require('mongoose');

const featureFlagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  key: {
    type: String,
    required: true,
    unique: true
  },
  isEnabled: {
    type: Boolean,
    default: false
  },
  description: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('FeatureFlag', featureFlagSchema);
