const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/auth');

// Create new order
router.post('/', protect, async (req, res) => {
  const { items, shippingDetails, paymentMethod, totalPrice, taxPrice, shippingPrice } = req.body;

  if (items && items.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  } else {
    try {
      const order = new Order({
        user: req.user._id,
        items,
        shippingDetails,
        paymentMethod,
        totalPrice,
        taxPrice,
        shippingPrice,
      });

      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(500).json({ message: error.message || 'Server error' });
    }
  }
});

// Get logged in user orders
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
