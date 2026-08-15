const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

class PdfGeneratorService {
  /**
   * Generates a PDF certificate from a base HTML template and dynamic variables.
   * @param {Object} certificate The Certificate document
   * @param {Object} template The CertificateTemplate document
   * @param {String} verificationUrl The full public URL for verifying this certificate
   * @returns {String} The file path or URL to the generated PDF
   */
  async generateCertificate(certificate, template, verificationUrl) {
    try {
      // 1. Generate QR Code as Base64 Image
      const qrCodeBase64 = await QRCode.toDataURL(verificationUrl, {
        errorCorrectionLevel: 'H',
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' }
      });

      // 2. Prepare Variables
      const variables = {
        studentName: certificate.metadata.studentName,
        courseName: certificate.metadata.courseName,
        achievementText: certificate.metadata.achievementText || 'successfully completed the course',
        issueDate: certificate.issuedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        certificateNumber: certificate.certificateNumber,
        verificationUrl: verificationUrl,
        qrCodeBase64: qrCodeBase64,
        ...template.designConfig
      };

      // 3. Compile HTML with Handlebars
      const compiledTemplate = handlebars.compile(template.baseHtml);
      const finalHtml = compiledTemplate(variables);

      // 4. Launch Puppeteer
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: 'new'
      });
      const page = await browser.newPage();
      
      // We set the content and wait for webfonts to load
      await page.setContent(finalHtml, { waitUntil: 'networkidle0' });

      // 5. Generate PDF
      // Ensure local storage directory exists
      const outputDir = path.join(__dirname, '../public/certificates');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const fileName = `${certificate.certificateNumber}.pdf`;
      const filePath = path.join(outputDir, fileName);

      await page.pdf({
        path: filePath,
        format: 'A4',
        landscape: true,
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
      });

      await browser.close();
      
      console.log(`Successfully generated PDF: ${fileName}`);
      
      // In production, upload to S3 and return the S3 URL. Here we return local path.
      return `/certificates/${fileName}`;
      
    } catch (error) {
      console.error('Failed to generate PDF Certificate:', error);
      throw new Error('PDF Generation failed');
    }
  }
}

module.exports = new PdfGeneratorService();
