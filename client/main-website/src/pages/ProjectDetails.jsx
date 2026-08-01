import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projects } from './Landing';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!project) {
    return (
      <div style={{ padding: '100px', textAlign: 'center' }}>
        <h2>Project not found</h2>
        <button onClick={() => navigate('/')} className="pill-button">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="becs-page" style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>
        {`
          .pd-card { padding: 80px 60px 60px; }
          .pd-title { font-size: 3.5rem; margin-bottom: 20px; color: var(--navy); line-height: 1.2; }
          .pd-back-btn { top: 30px; left: 30px; }
          
          @media (max-width: 768px) {
            .pd-card { padding: 70px 20px 40px; }
            .pd-title { font-size: 2.2rem; }
            .pd-back-btn { top: 15px; left: 15px; padding: 6px 12px; font-size: 0.9rem; }
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

      <main style={{ paddingTop: '120px', paddingBottom: '80px', flex: 1 }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', background: '#fff', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', overflow: 'hidden', position: 'relative' }}>
          
          {/* PERFECTLY POSITIONED BACK BUTTON */}
          <button 
            onClick={() => navigate(-1)} 
            className="pill-button pill-button--ghost pd-back-btn" 
            style={{ position: 'absolute', zIndex: 10, background: '#f8fafc', border: '1px solid var(--line)' }}
          >
            ← Back to Portfolio
          </button>

          <div className="pd-card" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* Header Section */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <span style={{ color: 'var(--accent)', fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>{project.category}</span>
                <span style={{ background: project.status === 'Completed' ? '#d1fae5' : '#dbeafe', color: project.status === 'Completed' ? '#065f46' : '#1e40af', padding: '6px 16px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 700 }}>{project.status}</span>
              </div>
              <h1 className="pd-title">{project.title}</h1>
            </div>

            {/* SINGLE IMAGE */}
            <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', aspectRatio: '21/9', width: '100%', background: '#f1f5f9' }}>
              <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>

            {/* CONTENT SECTION */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
              <div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '20px', color: 'var(--navy)' }}>Overview</h3>
                <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '1.1rem', marginBottom: '30px' }}>{project.overview}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {project.tech.map(t => <span key={t} style={{ background: '#f1f5f9', color: 'var(--navy)', padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600 }}>{t}</span>)}
                </div>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '20px', color: 'var(--navy)' }}>Impact & Features</h3>
                <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '1.1rem', background: '#f8fafc', padding: '24px', borderRadius: '12px', borderLeft: '4px solid var(--accent)' }}>{project.impact}</p>
              </div>
            </div>

            {/* CALL TO ACTION */}
            <div style={{ textAlign: 'center', marginTop: '20px', borderTop: '1px solid var(--line)', paddingTop: '40px' }}>
              <h3 style={{ color: 'var(--navy)', fontSize: '1.5rem', marginBottom: '24px' }}>Interested in building something similar?</h3>
              <a href="/contact" className="pill-button" style={{ 
                display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', 
                padding: '16px 48px', fontSize: '1.15rem', background: 'linear-gradient(135deg, var(--accent), var(--teal))', 
                color: '#fff', border: 'none', boxShadow: '0 10px 25px rgba(34, 211, 238, 0.3)', 
                transition: 'transform 0.3s, box-shadow 0.3s' 
              }} 
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(34, 211, 238, 0.4)'; }} 
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(34, 211, 238, 0.3)'; }}
              >
                Enquire Now <span>→</span>
              </a>
            </div>

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
            </ul>
          </div>

        </div>

        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', color: '#64748b', fontSize: '0.9rem' }}>
          <span>&copy; {new Date().getFullYear()} BECS. All rights reserved.</span>
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

export default ProjectDetails;
