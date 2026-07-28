import re

with open('src/pages/Landing.jsx', 'r') as f:
    content = f.read()

# 1. Navbar modification
navbar_target = r"""<a href="#products">BECS Store</a>\s*<a href="#projects">Portfolio</a>"""
navbar_replacement = """<a href="#products">BECS Store</a>
            <div className="nav-dropdown-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
              <a href="#partners" className="nav-item-dropdown" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Partners ▾</a>
              <div className="mega-dropdown" style={{ 
                position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', 
                background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(16px)', 
                borderRadius: '18px', padding: '24px', width: '380px', 
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.05)', 
                opacity: 0, visibility: 'hidden', transition: 'all 0.3s ease', zIndex: 1000 
              }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <img src="https://kritconsultancy.com/wp-content/uploads/2023/12/KRIT-Consultancy.png" alt="KRIT Consultancy" style={{ width: '60px', height: '60px', objectFit: 'contain', background: '#f8fafc', padding: '8px', borderRadius: '12px' }} onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=KRIT&background=2563EB&color=fff&size=60'; }} />
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', background: '#d1fae5', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Official Technology Partner</span>
                    <h4 style={{ margin: '8px 0 4px', fontSize: '1.2rem', color: 'var(--navy)' }}>KRIT Consultancy</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>AI, Cloud, Software Development, Data Analytics & Digital Transformation.</p>
                    <a href="https://kritconsultancy.com/" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent)', textDecoration: 'none' }}>Visit Website ↗</a>
                  </div>
                </div>
              </div>
            </div>
            <a href="#projects">Portfolio</a>"""

content = re.sub(navbar_target, navbar_replacement, content)

# 2. Homepage Section modification
section_target = r"""(<section className="section-white">
\s*<div className="container">
\s*<div className="section-heading">
\s*<span className="section-pill">Expertise</span>)"""
section_replacement = """<section className="section-white" id="partners">
          <div className="container">
            <div className="section-heading">
              <span className="section-pill" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>Partnership</span>
              <h2>Our Strategic Technology Partner</h2>
              <p>Collaborating with industry leaders to deliver enterprise-grade digital transformation.</p>
            </div>
            
            <div className="partners-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
              <div className="partner-card" style={{ 
                background: '#ffffff', borderRadius: '20px', padding: '40px', 
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0',
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)'; }}>
                <img src="https://kritconsultancy.com/wp-content/uploads/2023/12/KRIT-Consultancy.png" alt="KRIT Consultancy" style={{ width: '120px', height: '60px', objectFit: 'contain', marginBottom: '24px' }} onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=KRIT+Consultancy&background=fff&color=2563EB&size=120'; }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981', background: '#d1fae5', padding: '6px 12px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Official Technology Partner</span>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--navy)', marginBottom: '16px' }}>KRIT Consultancy</h3>
                <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '32px', fontSize: '1.05rem' }}>
                  Driving innovation through Artificial Intelligence, Cloud Computing, Data Analytics, Custom Software Development, Mobile Applications, DevOps, and Digital Transformation. Official Technology Partner of BECS.
                </p>
                <div style={{ display: 'flex', gap: '16px', marginTop: 'auto' }}>
                  <a href="https://kritconsultancy.com/" target="_blank" rel="noreferrer" className="pill-button pill-button--solid" style={{ background: 'var(--navy)', color: '#fff' }}>Visit Website</a>
                  <a href="https://kritconsultancy.com/" target="_blank" rel="noreferrer" className="pill-button pill-button--ghost">Learn More</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        \\1"""

content = re.sub(section_target, section_replacement, content)

# 3. Footer modification
footer_target = r"""(<div className="footer-brand">.*?</ul>\s*</div>)"""
footer_replacement = """\\1
          <div className="footer-partner" style={{ flex: '1', minWidth: '250px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#fff' }}>Strategic Partner</h3>
            <a href="https://kritconsultancy.com/" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
              <img src="https://kritconsultancy.com/wp-content/uploads/2023/12/KRIT-Consultancy.png" alt="KRIT Consultancy" style={{ width: '40px', height: '40px', objectFit: 'contain', background: '#fff', borderRadius: '8px', padding: '4px' }} onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=KRIT&background=fff&color=2563EB&size=40'; }} />
              <div>
                <strong style={{ display: 'block', color: '#fff', fontSize: '1.05rem', marginBottom: '4px' }}>KRIT Consultancy</strong>
                <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>Official Technology Partner ↗</span>
              </div>
            </a>
          </div>"""

content = re.sub(footer_target, footer_replacement, content, count=1, flags=re.DOTALL)

with open('src/pages/Landing.jsx', 'w') as f:
    f.write(content)

