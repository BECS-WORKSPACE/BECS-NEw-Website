const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  description: { type: String },
  image: { type: String },
  stock: { type: Number, default: 0 },
  badge: { type: String },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  specs: [{ type: String }],
  delivery: { type: String },
  status: { type: String, default: 'Published' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
