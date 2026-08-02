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
            <div style={{ textAlign: 'center', animation: 'fadeInUp 0.8s ease-out' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <span style={{ color: 'var(--accent)', fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>{project.category}</span>
                <span style={{ background: project.status === 'Completed' ? '#d1fae5' : '#dbeafe', color: project.status === 'Completed' ? '#065f46' : '#1e40af', padding: '6px 16px', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 700 }}>{project.status}</span>
              </div>
              <h1 className="pd-title" style={{ background: 'linear-gradient(135deg, var(--navy), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{project.title}</h1>
            </div>

            {/* SINGLE IMAGE */}
            <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.08)', width: '100%', height: '60vh', minHeight: '450px', maxHeight: '650px', background: 'radial-gradient(circle at center, #ffffff 0%, #f1f5f9 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'scaleIn 1s cubic-bezier(0.16, 1, 0.3, 1)', position: 'relative' }}>
              <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '20px', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.2))', zIndex: 2 }} />
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `url(${project.image}) center/cover`, filter: 'blur(40px)', opacity: 0.3, zIndex: 1 }}></div>
            </div>

            <style>
              {`
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes scaleIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
                @keyframes slideInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                .anim-delay-1 { animation: slideInUp 0.8s ease-out 0.2s both; }
                .anim-delay-2 { animation: slideInUp 0.8s ease-out 0.4s both; }
                
                .glass-card {
                  background: rgba(255, 255, 255, 0.8);
                  backdrop-filter: blur(20px);
                  border: 1px solid rgba(255,255,255,0.8);
                  border-radius: 24px;
                  padding: 40px;
                  box-shadow: 0 10px 40px rgba(0,0,0,0.04);
                  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
                  display: flex;
                  flex-direction: column;
                }
                .glass-card:hover {
                  transform: translateY(-8px);
                  box-shadow: 0 25px 50px rgba(0,0,0,0.08);
                }
              `}
            </style>

            {/* CONTENT SECTION */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', marginTop: '10px' }}>
              <div className="anim-delay-1 glass-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '30px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--accent)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '1.4rem', boxShadow: '0 8px 20px rgba(14, 165, 233, 0.3)' }}>🎯</div>
                  <h3 style={{ fontSize: '2rem', color: 'var(--navy)', margin: 0, fontFamily: 'Outfit, sans-serif' }}>Overview</h3>
                </div>
                <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '1.15rem', marginBottom: '30px', fontWeight: 500, flexGrow: 1 }}>{project.overview}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: 'auto' }}>
                  {project.tech.map(t => <span key={t} style={{ background: 'var(--navy)', color: '#fff', padding: '8px 16px', borderRadius: '24px', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.5px' }}>{t}</span>)}
                </div>
              </div>
              
              <div className="anim-delay-2 glass-card" style={{ background: 'linear-gradient(145deg, #ffffff, #f8fafc)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '30px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#10b981', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '1.4rem', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)' }}>⚡</div>
                  <h3 style={{ fontSize: '2rem', color: 'var(--navy)', margin: 0, fontFamily: 'Outfit, sans-serif' }}>Impact & Features</h3>
                </div>
                <p style={{ color: '#334155', lineHeight: 1.9, fontSize: '1.15rem', fontWeight: 500 }}>{project.impact}</p>
              </div>
            </div>

            {/* CALL TO ACTION */}
            <div style={{ textAlign: 'center', marginTop: '40px', padding: '50px 20px', background: 'var(--navy)', borderRadius: '24px', animation: 'fadeInUp 1s ease-out 0.6s both' }}>
              <h3 style={{ color: '#fff', fontSize: '2rem', marginBottom: '16px', fontFamily: 'Outfit' }}>Ready to build something similar?</h3>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>Let our engineering team help you bring your vision to life.</p>
              <a href="/contact" className="pill-button" style={{ 
                display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', 
                padding: '16px 48px', fontSize: '1.15rem', background: 'linear-gradient(135deg, var(--accent), var(--teal))', 
                color: '#fff', border: 'none', boxShadow: '0 10px 25px rgba(34, 211, 238, 0.3)', 
                transition: 'transform 0.3s, box-shadow 0.3s', fontWeight: 700 
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

export default ProjectDetails;
