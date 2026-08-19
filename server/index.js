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
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

// Trust reverse proxy (Vercel, Render, Heroku) for rate limiting
app.set('trust proxy', 1);

app.use(helmet());
app.use(cookieParser());
// Allow specific CORS if frontend uses credentials
app.use(cors({ origin: true, credentials: true }));

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

// Capture raw body for signature verification in webhooks
app.use(express.json({
  verify: (req, res, buf) => {
    if (req.originalUrl.startsWith('/api/webhooks')) {
      req.rawBody = buf;
    }
  }
}));

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const adminSystemRoutes = require('./routes/adminSystemRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

app.use('/api/auth', authRoutes);
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/system', adminSystemRoutes);
const adminNotificationRoutes = require('./routes/adminNotificationRoutes');
app.use('/api/admin/notifications', adminNotificationRoutes);
app.use('/api/payments', paymentRoutes);

const subscriptionRoutes = require('./routes/subscriptionRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/webhooks', webhookRoutes);

// Training Institute Routes
const courseRoutes = require('./routes/courseRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
app.use('/api/courses', courseRoutes);
app.use('/api/enquiries', enquiryRoutes);

// Config Routes
const configRoutes = require('./routes/configRoutes');
app.use('/api/config', configRoutes);

// Learning LMS Routes
const learningRoutes = require('./routes/learningRoutes');
app.use('/api/learning', learningRoutes);

// New Models
const Contact = require('./models/Contact');
const Enquiry = require('./models/Enquiry');
const Course = require('./models/Course');
const Role = require('./models/Role');
const Lesson = require('./models/Lesson');

// Gamification & Notifications & Curriculum & Video & Admin Analytics Routes
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const curriculumRoutes = require('./routes/curriculumRoutes');
const videoRoutes = require('./routes/videoRoutes');
const adminAnalyticsRoutes = require('./routes/adminAnalyticsRoutes');
const liveClassRoutes = require('./routes/liveClassRoutes');
const testRoutes = require('./routes/testRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const libraryRoutes = require('./routes/libraryRoutes');
const discussionRoutes = require('./routes/discussionRoutes');
const teacherRoutes = require('./routes/teacherRoutes');

app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/curriculum', curriculumRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/admin-analytics', adminAnalyticsRoutes);
app.use('/api/live-classes', liveClassRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/teacher', teacherRoutes);

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

// Removed inline training institute endpoints (moved to separate routers)

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

// Load Live Classroom Socket logic
require('./socket/liveSocketManager')(io);
// Load Communication & Chat Socket logic
require('./socket/chatEngine')(io);

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
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error('ERROR: MONGO_URI is missing from environment variables!');
  process.exit(1);
}
console.log(`Connecting to MongoDB Atlas...`);
mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 10000 })
  .then(() => {
    console.log('Connected to MongoDB Atlas successfully!');
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    console.log('Server is running but database features are unavailable.');
  });
