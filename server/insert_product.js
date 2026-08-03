const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const demoProduct = new Product({
      name: 'Razorpay Testing Demo Product (Do Not Ship)',
      category: 'Electronics',
      price: 1,
      originalPrice: 100,
      description: 'This is a demo product priced at 1 rupee for testing Razorpay live payments.',
      image: 'https://via.placeholder.com/300?text=Testing+Demo',
      stock: 999,
      badge: 'Test',
      rating: 5,
      reviews: 1,
      specs: ['Demo Product', '1 Rupee Only'],
      delivery: 'Free Delivery',
      status: 'Published'
    });

    await demoProduct.save();
    console.log('Demo product inserted successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
    process.exit(1);
  });
