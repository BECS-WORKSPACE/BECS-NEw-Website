import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Footer() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password' || location.pathname === '/reset-password' || location.pathname === '/verify-otp';

  if (isAuthPage) {
    return (
      <footer style={{ background: '#fff', borderTop: '1px solid #f1f5f9', padding: '24px 0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
            &copy; {new Date().getFullYear()} BECS Store. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {['Privacy Policy', 'Terms', 'Refund Policy', 'Contact Support'].map(link => (
              <Link key={link} to={`/${link.toLowerCase().replace(' ', '-')}`} style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#0f172a'} onMouseOut={e => e.currentTarget.style.color = '#64748b'}>{link}</Link>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="https://www.linkedin.com/company/becselectronics" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }} aria-label="LinkedIn" onMouseOver={e => e.currentTarget.style.color = '#6366f1'} onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="https://www.facebook.com/BanerjeeElectronicsConsultancyServices/" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }} aria-label="Facebook" onMouseOver={e => e.currentTarget.style.color = '#6366f1'} onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="https://www.instagram.com/_b.e.c.s_/" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }} aria-label="Instagram" onMouseOver={e => e.currentTarget.style.color = '#6366f1'} onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
            </a>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer style={{ background: '#0f172a', color: '#fff', paddingTop: '80px', borderTop: '4px solid #6366f1' }}>
      <div className="container" style={{ padding: '0 24px' }}>

        {/* Top Section: Newsletter & Branding */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', paddingBottom: '60px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', marginBottom: '20px' }}>
              <img src={`${import.meta.env.BASE_URL}org_logo.png`} alt="BECS" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '1.6rem', lineHeight: 1, letterSpacing: '-0.5px', fontWeight: 800, color: '#fff' }}>BECS</strong>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '2px' }}>STORE</span>
              </div>
            </Link>
            <p style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px', maxWidth: '300px' }}>
              The premium marketplace for industrial electronics, automation components, and IoT development kits.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="https://www.linkedin.com/company/becselectronics" target="_blank" rel="noreferrer" style={{ color: '#fff', background: 'rgba(255,255,255,0.1)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'background 0.2s' }} aria-label="LinkedIn" onMouseOver={e => e.currentTarget.style.background = '#6366f1'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://www.facebook.com/BanerjeeElectronicsConsultancyServices/" target="_blank" rel="noreferrer" style={{ color: '#fff', background: 'rgba(255,255,255,0.1)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'background 0.2s' }} aria-label="Facebook" onMouseOver={e => e.currentTarget.style.background = '#6366f1'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://www.instagram.com/_b.e.c.s_/" target="_blank" rel="noreferrer" style={{ color: '#fff', background: 'rgba(255,255,255,0.1)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'background 0.2s' }} aria-label="Instagram" onMouseOver={e => e.currentTarget.style.background = '#6366f1'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
              </a>
            </div>
          </div>

          <div style={{ gridColumn: 'auto / span 2' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.5px' }}>Subscribe to our Newsletter</h3>
            <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Get the latest updates on new products and upcoming sales.</p>
            <form style={{ display: 'flex', gap: '12px', maxWidth: '500px' }} onSubmit={e => { e.preventDefault(); alert('Subscribed to Newsletter successfully!'); }}>
              <input type="email" placeholder="Email address" required style={{ flex: 1, padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '1rem', outline: 'none' }} />
              <button type="submit" style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '0 32px', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#4f46e5'} onMouseOut={e => e.currentTarget.style.background = '#6366f1'}>Subscribe</button>
            </form>
          </div>
        </div>

        {/* Middle Section: Links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '40px', padding: '60px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '24px', letterSpacing: '0.5px' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Home', 'Shop', 'Categories', 'About Us', 'Contact', 'Blog'].map(link => (
                <li key={link}><Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}>{link}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '24px', letterSpacing: '0.5px' }}>Customer Service</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Shipping Policy', 'Refund Policy', 'Track Order', 'FAQs', 'Support'].map(link => (
                <li key={link}><Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}>{link}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '24px', letterSpacing: '0.5px' }}>Categories</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Arduino', 'Sensors', 'Automation', 'IoT', 'Industrial', 'Educational Kits'].map(link => (
                <li key={link}><Link to={`/products?search=${link}`} style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}>{link}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '24px', letterSpacing: '0.5px' }}>Contact Us</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px', color: '#94a3b8' }}>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.2rem' }}>📍</span>
                <span>70/5, Banerjee Para Rd, Kamala Park, Sarsuna, Kolkata<br />India, West Bengal 700061</span>
              </li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem' }}>✉</span>
                <a href="mailto:admin@becsofficial.com" style={{ color: '#94a3b8', textDecoration: 'none' }}>admin@becsofficial.com</a>
              </li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem' }}>📞</span>
                <a href="tel:+919830640683" style={{ color: '#94a3b8', textDecoration: 'none' }}>+91 9830640683</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright & Payments */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px', padding: '30px 0', color: '#94a3b8', fontSize: '0.9rem' }}>
          <div>
            <div>© 2026 BECS Store. All rights reserved. <span style={{ marginLeft: '12px' }}>Powered by BECS</span></div>
            <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#64748b' }}>GSTIN: 19BKNPB0402R1ZZ</div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ marginRight: '8px' }}>Secure Payments:</span>
            {/* Payment Method Badges (Placeholders) */}
            {['Visa', 'MasterCard', 'UPI', 'Razorpay'].map(method => (
              <span key={method} style={{ background: '#fff', color: '#0f172a', padding: '4px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>{method}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
