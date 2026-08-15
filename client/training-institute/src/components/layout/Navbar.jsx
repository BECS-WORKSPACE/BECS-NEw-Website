import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationCenter from '../common/NotificationCenter';

const Navbar = () => {
  const { user, handleLogout, isDarkMode, setIsDarkMode } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'https://www.becsofficial.com';
  const baseUrl = import.meta.env.BASE_URL || '/';

  const handleNavClick = (e, path, targetId = null) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    if (location.pathname !== path) {
      navigate(path);
      // Need a slight delay to allow navigation to complete before scrolling
      if (targetId) {
        setTimeout(() => {
          scrollToElement(targetId);
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      if (targetId) {
        scrollToElement(targetId);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const scrollToElement = (targetId) => {
    const el = document.getElementById(targetId);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const onLogout = () => {
    handleLogout();
    navigate('/');
  };

  return (
    <>
      <div className="top-strip" style={{ background: 'var(--primary)', color: 'white' }}>
        <div className="marquee-container">
          <div className="marquee-content">
            <span>🎉 Enroll Now for the 2026-27 Sessions!</span>
            <span>⭐ Congratulations to our students for outstanding results!</span>
            <span>🔥 Exclusive Scholarships Available.</span>
            <span>📞 Call us at +91 98765 43210 for free counseling.</span>
          </div>
        </div>
      </div>
      <nav className="navbar">
        <div className="container navbar-inner">
          <Link to="/" className="brand" onClick={(e) => { if(location.pathname === '/') { e.preventDefault(); window.scrollTo(0,0); } }}>
            <img src={`${baseUrl}logo.png`} alt="BECS Eduverse Logo" className="brand-logo" />
            <div className="brand-text-container">
              <span className="brand-text">BECS Eduverse</span>
              <span className="brand-subtext">Learn • Rise • Lead</span>
            </div>
          </Link>
          <div className="nav-links">
            <a href="#courses" className="nav-item" onClick={(e) => handleNavClick(e, '/', 'courses')}>Courses</a>
            <a href="#counselling" className="nav-item" onClick={(e) => handleNavClick(e, '/', 'counselling')}>Counselling</a>
            <a href="#memberships" className="nav-item" onClick={(e) => handleNavClick(e, '/', 'memberships')}>Memberships</a>
            <a href="#about" className="nav-item" onClick={(e) => handleNavClick(e, '/', 'about')}>About Us</a>
          </div>
          <div className="nav-actions">
            <button className="theme-toggle-btn" onClick={() => setIsDarkMode(!isDarkMode)} aria-label="Toggle Theme">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <a href={frontendUrl} className="btn-outline-sm desktop-only" style={{ textDecoration: 'none', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Main Website</a>
            {user ? (
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <NotificationCenter />
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Link to="/dashboard" className="btn-solid nav-cta" style={{ textDecoration: 'none' }}>Dashboard</Link>
                  <button className="btn-outline-sm" onClick={onLogout} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: 'var(--primary)', borderColor: 'var(--primary)' }}>Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-solid nav-cta" style={{ textDecoration: 'none' }}>Portal Login</Link>
            )}
            <button className="hamburger-btn" onClick={() => setIsMobileMenuOpen(true)}>☰</button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div className={`mobile-sidebar-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
      <div className={`mobile-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-sidebar-header">
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>Menu</span>
          <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>✕</button>
        </div>
        <nav className="mobile-nav">
          <a href="#courses" onClick={(e) => handleNavClick(e, '/', 'courses')}>Courses</a>
          <a href="#counselling" onClick={(e) => handleNavClick(e, '/', 'counselling')}>Counselling</a>
          <a href="#memberships" onClick={(e) => handleNavClick(e, '/', 'memberships')}>Memberships</a>
          <a href="#about" onClick={(e) => handleNavClick(e, '/', 'about')}>About Us</a>
          <button className="btn-outline-sm" onClick={() => { setIsDarkMode(!isDarkMode); setIsMobileMenuOpen(false); }} style={{ marginTop: '10px' }}>
            Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
          </button>
          <a href={frontendUrl} onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--accent)', marginTop: '20px' }}>Back to Main Website</a>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
