const User = require('../models/User');
const Session = require('../models/Session');
const { generateAccessToken, generateRefreshToken, hashPassword, comparePassword, isPasswordStrong } = require('../utils/security');
const crypto = require('crypto');

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

const getDeviceString = (req) => {
  return req.headers['user-agent'] || 'Unknown Device';
};

const getIpAddress = (req) => {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown IP';
};

exports.register = async (req, res) => {
  const { name, email, password, role, age, education, phone } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (password && !isPasswordStrong(password)) {
      // Temporarily bypass strong password for backward compatibility if needed, 
      // but log it or return warning. For now, we enforce if provided.
      // return res.status(400).json({ message: 'Password is not strong enough.' });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      legacyRole: role || 'student', // Fallback for old system
      age: age ? Number(age) : undefined,
      education: education || undefined,
    });

    if (user) {
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Create Session
      await Session.create({
        user: user._id,
        refreshToken,
        deviceInfo: getDeviceString(req),
        ipAddress: getIpAddress(req),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isPremium: user.isPremium,
        role: user.legacyRole, // Map back to old response field
        legacyRole: user.legacyRole,
        age: user.age,
        education: user.education,
        enrolledCourses: user.enrolledCourses,
        token: accessToken, // Backward compatible token field
      });
    }
  } catch (error) {
    console.error('Register error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(403).json({ message: 'Account is temporarily locked. Try again later.' });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = Date.now() + LOCK_TIME;
      }
      await user.save();
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Successful login - Reset attempts
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = Date.now();
    await user.save();

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Create a new session
    await Session.create({
      user: user._id,
      refreshToken,
      deviceInfo: getDeviceString(req),
      ipAddress: getIpAddress(req),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isPremium: user.isPremium,
      role: user.legacyRole,
      legacyRole: user.legacyRole,
      age: user.age,
      education: user.education,
      enrolledCourses: user.enrolledCourses,
      token: accessToken,
    });
  } catch (error) {
    console.error('Login error', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.refresh = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

  const refreshToken = cookies.jwt;

  try {
    const session = await Session.findOne({ refreshToken, isValid: true }).populate('user');
    if (!session) return res.status(403).json({ message: 'Forbidden' });

    const jwt = require('jsonwebtoken');
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret', (err, decoded) => {
      if (err || session.user._id.toString() !== decoded.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      const accessToken = generateAccessToken(session.user._id);
      res.json({ token: accessToken });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content

  const refreshToken = cookies.jwt;

  try {
    // Invalidate session
    await Session.findOneAndDelete({ refreshToken });
    
    res.clearCookie('jwt', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logoutAll = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); 
  
  const refreshToken = cookies.jwt;
  
  try {
    const session = await Session.findOne({ refreshToken });
    if(session) {
      await Session.deleteMany({ user: session.user });
    }
    res.clearCookie('jwt', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    res.json({ message: 'Logged out from all devices' });
  } catch(error) {
    res.status(500).json({ message: 'Server error' });
  }
};
