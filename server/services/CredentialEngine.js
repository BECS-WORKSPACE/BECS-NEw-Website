const crypto = require('crypto');
const CertificateEligibilityRule = require('../models/CertificateEligibilityRule');
const Certificate = require('../models/Certificate');
const CertificateTemplate = require('../models/CertificateTemplate');
const CertificateAuditLog = require('../models/CertificateAuditLog');
const LearningProgress = require('../models/LearningProgress');
const TestResult = require('../models/TestResult');
const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const PdfGeneratorService = require('./PdfGeneratorService');
const NotificationService = require('./NotificationService');

class CredentialEngine {
  
  /**
   * Evaluates if a student meets the criteria for a certificate.
   * If they do, it automatically generates and issues the certificate.
   * This should be called asynchronously so it doesn't block the main thread.
   */
  async evaluate(userId, courseId) {
    try {
      // 1. Find active rules for this course
      const rule = await CertificateEligibilityRule.findOne({ course: courseId, isActive: true }).populate('template');
      if (!rule || !rule.autoIssue) return { eligible: false, reason: 'No active auto-issue rule' };

      // 2. Check if certificate already exists (idempotency)
      const existingCert = await Certificate.findOne({ student: userId, course: courseId, status: { $in: ['valid', 'revoked'] } });
      if (existingCert) return { eligible: false, reason: 'Certificate already issued' };

      // 3. Evaluate Criteria
      let eligible = true;

      // Check Video Completion
      if (rule.rules.minVideoCompletionPercent > 0) {
        const totalLessons = await Lesson.countDocuments({ course: courseId });
        const completedLessons = await LearningProgress.countDocuments({ user: userId, course: courseId, isCompleted: true });
        const completionPercent = totalLessons === 0 ? 0 : (completedLessons / totalLessons) * 100;
        
        if (completionPercent < rule.rules.minVideoCompletionPercent) {
          eligible = false;
        }
      }

      // Check Test Scores (assuming test score is out of 100 or accuracyPercentage)
      if (eligible && rule.rules.minFinalTestScore > 0) {
        // Find best test result for the student in this course
        // (Assuming tests are linked to courses in your schema. If not, this logic needs adapting)
        // Here we just grab the highest accuracyPercentage the user has achieved recently.
        // A robust LMS would link `Test` to `Course`. We will assume `TestResult` can be queried broadly.
        // For demonstration, let's assume they must have at least one test result >= rule.rules.minFinalTestScore
        const bestResult = await TestResult.findOne({ studentId: userId }).sort({ score: -1 });
        const score = bestResult ? bestResult.score : 0; // Or bestResult.accuracyPercentage

        if (score < rule.rules.minFinalTestScore) {
          eligible = false;
        }
      }

      // 4. Issue Certificate if eligible
      if (eligible) {
        return await this.issueCertificate(userId, courseId, rule.template);
      }

      return { eligible: false, reason: 'Criteria not met' };
    } catch (error) {
      console.error('CredentialEngine Evaluation Error:', error);
      throw error;
    }
  }

  /**
   * Core logic to issue a certificate, generate PDF, and notify user.
   */
  async issueCertificate(userId, courseId, template) {
    try {
      const student = await User.findById(userId);
      const course = await Course.findById(courseId);

      // Generate cryptographically secure IDs
      const certificateNumber = `EDU-${new Date().getFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
      const verificationId = crypto.randomUUID();
      const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/${verificationId}`;

      // Create Database Record
      const certificate = await Certificate.create({
        student: userId,
        course: courseId,
        template: template._id,
        certificateNumber,
        verificationId,
        metadata: {
          studentName: `${student.firstName} ${student.lastName}`,
          courseName: course ? course.title : 'EduVerse Program',
          achievementText: 'successfully completed the requirements'
        }
      });

      // Generate PDF Document
      // We pass the full template object which contains the baseHtml and designConfig
      const pdfUrl = await PdfGeneratorService.generateCertificate(certificate, template, verificationUrl);

      // Update Database with PDF URL
      certificate.pdfUrl = pdfUrl;
      await certificate.save();

      // Create Audit Log
      await CertificateAuditLog.create({
        certificate: certificate._id,
        action: 'issued',
        reason: 'Auto-issued via CredentialEngine rules'
      });

      // Notify the Student using the Centralized NotificationService
      await NotificationService.dispatch({
        user: userId,
        type: 'CERTIFICATE_ISSUED',
        priority: 'high',
        title: 'New Certificate Earned! 🏆',
        message: `Congratulations! You have earned a certificate for ${certificate.metadata.courseName}.`,
        actionLink: `/dashboard/certificates/${certificate._id}`,
        actionText: 'View Certificate',
        metadata: {
          category: 'courses',
          certificateId: certificate._id
        }
      });

      console.log(`Successfully issued certificate ${certificateNumber} to user ${userId}`);
      return { eligible: true, certificate };
    } catch (error) {
      console.error('Failed to issue certificate:', error);
      throw error;
    }
  }
}

module.exports = new CredentialEngine();
