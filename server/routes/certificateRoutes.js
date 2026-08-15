const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const CertificateAuditLog = require('../models/CertificateAuditLog');
const { protect } = require('../middleware/auth');

// @desc    Public Certificate Verification Endpoint
// @route   GET /api/certificates/verify/:verificationId
// @access  Public
router.get('/verify/:verificationId', async (req, res) => {
  try {
    const { verificationId } = req.params;

    const certificate = await Certificate.findOne({ verificationId })
      .select('-pdfUrl -__v') // Explicitly exclude sensitive info, though mostly metadata is used
      .lean();

    if (!certificate) {
      return res.status(404).json({ valid: false, message: 'Certificate not found.' });
    }

    // Log the public verification event for auditing (asynchronous fire-and-forget)
    CertificateAuditLog.create({
      certificate: certificate._id,
      action: 'verified_publicly',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    }).catch(err => console.error('Audit Log failed', err));

    res.json({
      valid: certificate.status === 'valid',
      status: certificate.status,
      certificateNumber: certificate.certificateNumber,
      issuedAt: certificate.issuedAt,
      metadata: certificate.metadata,
      revocationReason: certificate.revocationReason // Only present if revoked
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error during verification' });
  }
});

// @desc    Get Student's Own Certificates
// @route   GET /api/certificates/mine
// @access  Private
router.get('/mine', protect, async (req, res) => {
  try {
    const certificates = await Certificate.find({ student: req.user._id })
      .populate('course', 'title thumbnail')
      .sort({ issuedAt: -1 });

    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching certificates' });
  }
});

module.exports = router;
