import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent successfully! We'll be in touch soon.");
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1500);
  };

  return (
    <div className="becs-page" style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>
        {`
          .contact-card { padding: 60px; }
          .contact-title { font-size: 3.5rem; margin-top: 10px; margin-bottom: 20px; color: var(--navy); line-height: 1.2; }
          .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
          
          @media (max-width: 768px) {
            .contact-card { padding: 40px 20px; }
            .contact-title { font-size: 2.2rem; }
            .contact-grid { grid-template-columns: 1fr; }
          }
        `}
      </style>

      <header className="topbar topbar--scrolled">
        <div className="container topbar-inner">
          <Link to="/" className="brand" style={{ textDecoration: 'none' }}>
            <img src="/logo.png" alt="BECS Logo" style={{ width: '60px', height: '50px', objectFit: 'contain' }} />
            <span className="brand-name">BECS</span>
          </Link>
        </div>
      </header>

      <main style={{ paddingTop: '120px', paddingBottom: '80px', flex: 1, position: 'relative' }}>
        
        {/* PERFECTLY POSITIONED BACK BUTTON */}
        <div className="container" style={{ position: 'relative', marginBottom: '20px' }}>
          <Link 
            to="/" 
            className="pill-button pill-button--ghost" 
            style={{ position: 'absolute', top: 0, left: '15px', padding: '8px 16px', zIndex: 10, background: '#fff', border: '1px solid var(--line)', textDecoration: 'none' }}
          >
            ← Back to Home
          </Link>
        </div>

        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '40px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ color: 'var(--accent)', fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>Get in Touch</span>
            <h1 className="contact-title">Contact Us</h1>
            <p style={{ color: '#475569', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', padding: '0 15px' }}>Have a project in mind or need assistance? Fill out the form below and our team will get back to you shortly.</p>
          </div>

          <div className="contact-card" style={{ background: '#fff', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="contact-grid">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '0.95rem' }}>Full Name *</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                    style={{ padding: '16px', borderRadius: '12px', border: '1px solid #dbe2ef', background: '#f8fafc', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = '#dbe2ef'}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '0.95rem' }}>Email Address *</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                    style={{ padding: '16px', borderRadius: '12px', border: '1px solid #dbe2ef', background: '#f8fafc', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = '#dbe2ef'}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '0.95rem' }}>Subject</label>
                <input 
                  type="text" 
                  value={subject} 
                  onChange={e => setSubject(e.target.value)} 
                  style={{ padding: '16px', borderRadius: '12px', border: '1px solid #dbe2ef', background: '#f8fafc', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = '#dbe2ef'}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '0.95rem' }}>Message *</label>
                <textarea 
                  rows="6" 
                  value={message} 
                  onChange={e => setMessage(e.target.value)} 
                  required 
                  style={{ padding: '16px', borderRadius: '12px', border: '1px solid #dbe2ef', background: '#f8fafc', fontSize: '1rem', outline: 'none', resize: 'vertical', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = '#dbe2ef'}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="pill-button"
                style={{ marginTop: '10px', padding: '18px', fontSize: '1.2rem', width: '100%', background: 'linear-gradient(135deg, var(--accent), var(--teal))', color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.8 : 1 }}
              >
                {loading ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer" style={{ marginTop: 'auto', background: '#f8fafc', borderTop: '1px solid var(--line)', paddingTop: '60px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', paddingBottom: '40px', borderBottom: '1px solid var(--line)' }}>
          
          {/* Brand Column */}
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <img src="/logo.png" alt="BECS Logo" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
              <h2 style={{ margin: 0, color: 'var(--accent)', fontSize: '1.8rem' }}>BECS.</h2>
            </div>
            <p style={{ color: '#475569', lineHeight: 1.6 }}>
              Banerjee Electronics Consultancy Services. Your trusted partner for
              innovative electronic solutions, automation, and premium tech supply.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="footer-col">
            <h3 style={{ fontSize: '1.2rem', color: 'var(--navy)', marginBottom: '20px' }}>Quick Links</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><a href="/" style={{ color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }}>Home</a></li>
              <li><a href="/#services" style={{ color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }}>Services</a></li>
              <li><a href="/#projects" style={{ color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }}>Portfolio</a></li>
              <li><a href="/contact" style={{ color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }}>Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Info Column */}
          <div className="footer-col">
            <h3 style={{ fontSize: '1.2rem', color: 'var(--navy)', marginBottom: '20px' }}>Contact Us</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', lineHeight: 1.5 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px', color: 'var(--accent)' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                70/5, Banerjee Para Rd, Kamala Park, Sarsuna, Kolkata, West Bengal 700061
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--accent)' }}><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                <a href="mailto:admin@becsofficial.com" style={{ color: '#475569', textDecoration: 'none' }}>admin@becsofficial.com</a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--accent)' }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <a href="tel:+919830640683" style={{ color: '#475569', textDecoration: 'none' }}>+91 9830640683</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', color: '#64748b', fontSize: '0.9rem' }}>
          <div>
            <span style={{ display: 'block' }}>&copy; {new Date().getFullYear()} BECS. All rights reserved.</span>
            <span style={{ display: 'block', marginTop: '4px', fontSize: '0.85rem' }}>GSTIN: 19BKNPB0402R1ZZ</span>
          </div>
          <div className="socials" style={{ display: 'flex', gap: '16px' }}>
            <a href="https://www.linkedin.com/company/becselectronics" target="_blank" rel="noreferrer" style={{ color: '#64748b', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }} aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="https://www.facebook.com/BanerjeeElectronicsConsultancyServices/" target="_blank" rel="noreferrer" style={{ color: '#64748b', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }} aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="https://www.instagram.com/_b.e.c.s_/" target="_blank" rel="noreferrer" style={{ color: '#64748b', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }} aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
