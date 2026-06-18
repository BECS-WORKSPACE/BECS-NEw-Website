const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

// Stripe Webhook MUST come before express.json()
app.post('/api/orders/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const Order = require('./models/Order');
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!endpointSecret) {
    console.log('STRIPE_WEBHOOK_SECRET is not defined, skipping signature verification for development');
  }

  let event;
  try {
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      event = JSON.parse(req.body.toString());
    }
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    try {
      if(paymentIntent.metadata && paymentIntent.metadata.orderId) {
        await Order.findByIdAndUpdate(paymentIntent.metadata.orderId, {
          isPaid: true,
          paidAt: Date.now(),
          status: 'Processing',
          paymentResult: {
            id: paymentIntent.id,
            status: paymentIntent.status,
            update_time: new Date().toISOString(),
          }
        });
        
        // Emit real-time event for admin dashboard
        if (global.io) {
          global.io.emit('new_order', { orderId: paymentIntent.metadata.orderId });
        }
        
        console.log(`Order ${paymentIntent.metadata.orderId} marked as paid via webhook`);
      }
    } catch (err) {
      console.error('Error updating order on webhook:', err);
    }
  }

  res.send();
});

app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/paymentRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

// New Models
const Contact = require('./models/Contact');
const Enquiry = require('./models/Enquiry');
const Course = require('./models/Course');

// Contact message endpoint (Main Website)
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }
  try {
    await Contact.create({ name, email, subject, message });
    res.status(200).json({ message: 'Message sent successfully! Thank you for contacting BECS.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Training Institute Public Endpoints
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/enquiries', async (req, res) => {
  const { name, phone, courseId, courseName, type } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ message: 'Name and Phone are required' });
  }
  try {
    await Enquiry.create({ name, phone, courseId, courseName, type });
    res.status(200).json({ message: 'Enquiry submitted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/', (req, res) => {
  res.send('BECS Ecommerce API is running...');
});

// Start server immediately
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

global.io = io;

io.on('connection', (socket) => {
  console.log('Client connected to Socket.IO');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Connect to MongoDB in the background
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://Becs2k26:Becs2k26@cluster0.hap0jpp.mongodb.net/?appName=Cluster0';
console.log(`Connecting to MongoDB Atlas...`);
mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 10000 })
  .then(() => {
    console.log('Connected to MongoDB Atlas successfully!');
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    console.log('Server is running but database features are unavailable.');
  });
