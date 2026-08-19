const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      // Use fallback secret to match what we did in security.js
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      
      // Populate role for RBAC
      req.user = await User.findById(decoded.id).select('-password').populate('role');
      
      if (!req.user) {
        return res.status(401).json({ message: 'User no longer exists' });
      }
      
      // Auto-expire premium subscription
      if (req.user.isPremium && req.user.subscriptionValidUntil && new Date(req.user.subscriptionValidUntil).getTime() < Date.now()) {
        req.user.isPremium = false;
        await req.user.save();
      }

      if (req.user.status !== 'active') {
        return res.status(403).json({ message: `Account is ${req.user.status}` });
      }
      
      return next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Not authorized, token expired' });
      }
      console.error('Auth middleware error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token' });
};

const admin = (req, res, next) => {
  // Check legacy isAdmin OR check if populated role name is 'Admin' or 'Super Admin'
  const isRoleAdmin = req.user.role && (req.user.role.name === 'Admin' || req.user.role.name === 'Super Admin');
  if (req.user && (req.user.isAdmin || isRoleAdmin)) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

// RBAC Middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    // Fallback for legacy seeded admins who only have isAdmin: true
    let userRole = (req.user.role && req.user.role.name) || req.user.legacyRole;
    if (!userRole && req.user.isAdmin) {
      userRole = 'Super Admin';
    }
    
    if (!roles.includes(userRole)) {
      return res.status(403).json({ 
        message: `User role ${userRole} is not authorized to access this route` 
      });
    }
    next();
  };
};

module.exports = { protect, admin, authorize };
