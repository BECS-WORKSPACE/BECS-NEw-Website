const express = require('express');
const router = express.Router();
const { protect, admin, authorize } = require('../middleware/auth');
const FeatureFlag = require('../models/FeatureFlag');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const CMSSection = require('../models/CMSSection');
const AuditLog = require('../models/AuditLog');
const Role = require('../models/Role');

// Middleware to log admin actions
const logAction = (action, entity) => async (req, res, next) => {
  const originalSend = res.send;
  res.send = function (data) {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      // Async log writing
      AuditLog.create({
        admin: req.user._id,
        action,
        entity,
        entityId: req.params.id || req.user._id,
        ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      }).catch(err => console.error('Failed to write audit log', err));
    }
    originalSend.call(this, data);
  };
  next();
};

// =======================
// FEATURE FLAGS
// =======================
router.get('/features', protect, admin, async (req, res) => {
  try {
    const features = await FeatureFlag.find({});
    res.json(features);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/features', protect, admin, authorize('Super Admin', 'Admin'), logAction('Create', 'FeatureFlag'), async (req, res) => {
  try {
    const feature = await FeatureFlag.create(req.body);
    res.status(201).json(feature);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/features/:id', protect, admin, authorize('Super Admin', 'Admin'), logAction('Update', 'FeatureFlag'), async (req, res) => {
  try {
    const feature = await FeatureFlag.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!feature) return res.status(404).json({ message: 'Feature flag not found' });
    res.json(feature);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// =======================
// SUBSCRIPTION PLANS
// =======================
router.get('/subscriptions', protect, admin, async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({});
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/subscriptions', protect, admin, authorize('Super Admin', 'Admin'), logAction('Create', 'SubscriptionPlan'), async (req, res) => {
  try {
    const plan = await SubscriptionPlan.create(req.body);
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/subscriptions/:id', protect, admin, authorize('Super Admin', 'Admin'), logAction('Update', 'SubscriptionPlan'), async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// =======================
// CMS SECTIONS
// =======================
router.get('/cms', protect, admin, async (req, res) => {
  try {
    const sections = await CMSSection.find({}).populate('updatedBy', 'name email');
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/cms/:id', protect, admin, authorize('Super Admin', 'Admin'), logAction('Update', 'CMSSection'), async (req, res) => {
  try {
    const payload = { ...req.body, updatedBy: req.user._id };
    const section = await CMSSection.findByIdAndUpdate(req.params.id, payload, { new: true });
    res.json(section);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// =======================
// AUDIT LOGS
// =======================
router.get('/audit', protect, admin, authorize('Super Admin'), async (req, res) => {
  try {
    const logs = await AuditLog.find({}).populate('admin', 'name email role').sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
