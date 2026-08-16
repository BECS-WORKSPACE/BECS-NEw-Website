import React from 'react';

const Footer = () => {
  return (
    <footer className="footer" style={{ background: '#111827', color: 'white', padding: '60px 0 20px 0' }}>
      <div className="container footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
        <div className="footer-brand">
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '15px' }}>BECS <span style={{ color: 'var(--primary)' }}>Eduverse</span></h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>India's next-generation student success platform integrating learning, mentoring, and psychological support.</p>
        </div>
        <div className="footer-links">
          <h4 style={{ color: 'white', marginBottom: '20px' }}>Quick Links</h4>
          <a href="#" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '10px', textDecoration: 'none' }}>Courses</a>
          <a href="#" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '10px', textDecoration: 'none' }}>Career</a>
          <a href="#" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '10px', textDecoration: 'none' }}>About Us</a>
          <a href="#" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '10px', textDecoration: 'none' }}>Contact</a>
        </div>
        <div className="footer-links">
          <h4 style={{ color: 'white', marginBottom: '20px' }}>Legal & Support</h4>
          <a href="#" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '10px', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '10px', textDecoration: 'none' }}>Terms of Service</a>
          <a href="#" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '10px', textDecoration: 'none' }}>Student Dashboard</a>
          <a href="#" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '10px', textDecoration: 'none' }}>Help Center</a>
        </div>
        <div className="footer-contact">
          <h4 style={{ color: 'white', marginBottom: '20px' }}>Contact Info</h4>
          <p style={{ color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', gap: '8px' }}><span>📍</span> <span>70/5, Banerjee Para Rd, Kamala Park, Sarsuna, Kolkata, West Bengal 700061</span></p>
          <p style={{ color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', gap: '8px' }}><span>✉️</span> <a href="mailto:admin@becsofficial.com" style={{ textDecoration: 'none' }}>admin@becsofficial.com</a></p>
          <p style={{ color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', gap: '8px' }}><span>📞</span> <a href="tel:+919830640683" style={{ textDecoration: 'none' }}>+91 9830640683</a></p>
          <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
            <a href="https://www.linkedin.com/company/becselectronics" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: 'white', borderRadius: '50%', transition: 'transform 0.2s', ':hover': { transform: 'scale(1.1)' } }} aria-label="LinkedIn">
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn" style={{ width: '20px', height: '20px', display: 'block', borderRadius: '2px' }} />
            </a>
            <a href="https://www.facebook.com/BanerjeeElectronicsConsultancyServices/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: 'white', borderRadius: '50%', transition: 'transform 0.2s', ':hover': { transform: 'scale(1.1)' } }} aria-label="Facebook">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" style={{ width: '20px', height: '20px', display: 'block' }} />
            </a>
            <a href="https://www.instagram.com/_b.e.c.s_/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: 'white', borderRadius: '50%', transition: 'transform 0.2s', ':hover': { transform: 'scale(1.1)' } }} aria-label="Instagram">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" style={{ width: '20px', height: '20px', display: 'block' }} />
            </a>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', borderTop: '1px solid #374151', paddingTop: '20px' }}>
        <div>&copy; {new Date().getFullYear()} BECS Eduverse. All Rights Reserved.</div>
        <div style={{ marginTop: '5px' }}>GSTIN: 19BKNPB0402R1ZZ</div>
      </div>
      <a href="https://wa.me/919830640683" className="whatsapp-button" target="_blank" rel="noopener noreferrer" title="Chat with us on WhatsApp">
        <svg viewBox="0 0 32 32" className="whatsapp-icon" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.002 2.128c-7.662 0-13.886 6.224-13.886 13.886 0 2.45.64 4.838 1.84 6.942L2 30l7.242-1.898a13.81 13.81 0 006.76 1.768h.004c7.66 0 13.884-6.224 13.884-13.884 0-3.714-1.446-7.206-4.072-9.832a13.792 13.792 0 00-9.816-4.026zM16.002 25.43h-.002a11.554 11.554 0 01-5.894-1.614l-.422-.25-4.382 1.15 1.168-4.272-.274-.436A11.558 11.558 0 014.35 16.012c0-6.422 5.226-11.646 11.654-11.646 3.112 0 6.036 1.212 8.236 3.414A11.574 11.574 0 0127.656 16.014c0 6.42-5.226 11.644-11.654 11.644v-.228z" fill="#fff" />
          <path d="M22.38 18.242c-.35-.176-2.064-1.02-2.384-1.136-.32-.118-.554-.176-.788.176-.232.35-.902 1.136-1.106 1.372-.204.234-.41.264-.76.088-.35-.176-1.472-.544-2.804-1.73-1.036-.924-1.736-2.066-1.94-2.418-.204-.352-.022-.542.152-.718.158-.158.35-.41.526-.614.174-.206.232-.352.35-.586.116-.234.058-.44-.03-.616-.088-.176-.788-1.9-1.08-2.604-.284-.686-.576-.592-.788-.602-.2-.01-.432-.012-.666-.012s-.612.088-.934.44c-.32.35-1.226 1.198-1.226 2.924s1.256 3.392 1.43 3.628c.176.234 2.474 3.776 5.992 5.296 2.502 1.082 3.402 1.166 4.67 1.01 1.054-.13 2.064-.844 2.354-1.66.29-.818.29-1.52.204-1.66-.088-.142-.322-.234-.672-.41z" fill="#fff" />
        </svg>
      </a>
    </footer>
  );
};

export default Footer;
