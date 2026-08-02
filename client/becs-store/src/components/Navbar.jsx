import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShopContext, formatPrice } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar() {
  const { cartSummary, user, handleLogout, wishlistItems, products } = React.useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const megaMenuRef = useRef(null);
  const headerRef = useRef(null);

  const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'https://www.becsofficial.com';

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      // Close mega menu if clicked outside
      if (showMegaMenu && headerRef.current && !headerRef.current.contains(event.target)) {
        setShowMegaMenu(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowMegaMenu(false);
        setSearchFocused(false);
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [showMegaMenu]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm) {
      setSearchFocused(false);
      navigate(`/products?search=${searchTerm}`);
    }
  };

  const closeMegaMenu = () => setShowMegaMenu(false);

  const filteredSuggestions = searchTerm.length > 1
    ? products?.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 5)
    : [];

  const megaMenuCategories = [
    { title: 'Electronics', items: ['Microcontrollers', 'Displays', 'Passive Components'] },
    { title: 'Arduino', items: ['Arduino UNO', 'Arduino Nano', 'Arduino Mega', 'Shields'] },
    { title: 'Sensors', items: ['Temperature', 'Motion', 'Proximity', 'Optical'] },
    { title: 'Automation', items: ['Smart Relays', 'PLCs', 'Contactors'] },
    { title: 'Industrial', items: ['Heavy Duty Modules', 'Industrial Sensors'] },
    { title: 'IoT', items: ['ESP32', 'NodeMCU', 'Wireless Modules'] },
    { title: 'Educational Kits', items: ['Starter Kits', 'Robotics Kits', 'DIY Projects'] },
    { title: 'Power', items: ['Power Supplies', 'Batteries', 'Converters'] }
  ];

  const categoryLinks = [
    { name: 'Shop', path: '/products?search=all' },
    { name: 'New Arrivals', path: '/products?search=new' },
    { name: 'Best Sellers', path: '/products?search=best' },
    { name: 'Brands', path: '/products?search=brands' },
    { name: 'Offers', path: '/products?search=offers', color: '#ef4444' },
    { name: 'Arduino', path: '/products?search=Arduino' },
    { name: 'Sensors', path: '/products?search=Sensors' },
    { name: 'Industrial', path: '/products?search=Industrial' },
    { name: 'IoT', path: '/products?search=IoT' }
  ];

  if (isAuthPage) {
    return (
      <header style={{ background: '#fff', borderBottom: '1px solid #f1f5f9', height: '80px', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <img src={`${import.meta.env.BASE_URL}org_logo.png`} alt="BECS" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
            <div style={{ color: '#0f172a' }}>
              <strong style={{ display: 'block', fontSize: '1.4rem', lineHeight: 1, letterSpacing: '-0.5px', fontWeight: 800 }}>BECS</strong>
              <span style={{ display: 'block', fontSize: '0.75rem', color: '#6366f1', fontWeight: 700, letterSpacing: '2px', marginTop: '2px' }}>STORE</span>
            </div>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link to="/" style={{ color: '#0f172a', fontSize: '0.95rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '30px', background: '#f8fafc', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'} onMouseOut={e => e.currentTarget.style.background = '#f8fafc'}>
              Return to Store
            </Link>
          </div>

        </div>
      </header>
    );
  }

  return (
    <>
      <header ref={headerRef} className="desktop-only" style={{ position: 'sticky', top: 0, zIndex: 1000, background: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e2e8f0', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.15)' }}>

        {/* 1. Top Announcement Bar */}
        <div className="desktop-only" style={{ background: '#0f172a', color: '#e2e8f0', fontSize: '0.8rem', height: '48px', display: 'flex', alignItems: 'center' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>

            {/* Left Spacer (for perfect centering) */}
            <div style={{ flex: 1 }}></div>

            {/* Center Content */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontWeight: 600, letterSpacing: '0.5px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color: '#fbbf24', fontSize: '0.9rem' }}>⚡</span> Free Shipping Above ₹499</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span>🚚</span> Fast Delivery</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span>🔒</span> Secure Payments</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span>↩</span> Easy Returns</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span>📞</span> Customer Support</span>
            </div>

            {/* Right Content */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <a href="https://www.becsofficial.com/" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s', letterSpacing: '0.5px' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}>Main Corporate Website ↗</a>
            </div>

          </div>
        </div>

        {/* 2. Main Header (Logo, Search, Icons) */}
        <div className="container desktop-only" style={{ height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo (Left Flank) */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', flexShrink: 0 }}>
              <img src={`${import.meta.env.BASE_URL}org_logo.png`} alt="BECS" style={{ width: '56px', height: '56px', objectFit: 'contain' }} />
              <div style={{ color: '#0f172a' }}>
                <strong style={{ display: 'block', fontSize: '1.8rem', lineHeight: 1, letterSpacing: '-0.5px', fontWeight: 800 }}>BECS</strong>
                <span style={{ display: 'block', fontSize: '0.85rem', color: '#6366f1', fontWeight: 700, letterSpacing: '2px', marginTop: '2px' }}>STORE</span>
              </div>
            </Link>
          </div>

          {/* Centered Amazon-Style Search Bar (Center Flank) */}
          <div ref={searchRef} style={{ flex: 2, display: 'flex', justifyContent: 'center', position: 'relative' }} className="desktop-only">
            <div style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: '12px', border: `2px solid ${searchFocused ? '#6366f1' : '#cbd5e1'}`, transition: 'all 0.2s ease', overflow: 'hidden', boxShadow: searchFocused ? '0 0 0 4px rgba(99,102,241,0.1)' : '0 2px 4px rgba(0,0,0,0.02)', width: '100%', maxWidth: '600px' }}>
              <input
                type="text"
                placeholder="Search for products, categories, or brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                onFocus={() => setSearchFocused(true)}
                style={{ flex: 1, padding: '14px 20px', border: 'none', background: 'transparent', outline: 'none', fontSize: '1rem', color: '#0f172a' }}
              />
              <button
                onClick={() => { if (searchTerm) navigate(`/products?search=${searchTerm}`); setSearchFocused(false); }}
                style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '0 28px', height: '50px', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = '#4f46e5'}
                onMouseOut={e => e.currentTarget.style.background = '#6366f1'}
              >
                🔍
              </button>
            </div>

            {/* Autocomplete Dropdown */}
            <AnimatePresence>
              {searchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.15 }}
                  style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px', background: '#fff', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0', overflow: 'hidden', zIndex: 1100 }}
                >
                  {!searchTerm ? (
                    <div style={{ padding: '16px' }}>
                      <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px' }}>Recent Searches</div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {['Arduino Uno', 'ESP32', 'Relay Module', 'Jumper Wires'].map(t => (
                          <span key={t} onClick={() => { setSearchTerm(t); navigate(`/products?search=${t}`); setSearchFocused(false); }} style={{ padding: '6px 12px', background: '#f1f5f9', borderRadius: '20px', fontSize: '0.9rem', cursor: 'pointer', color: '#334155' }}>{t}</span>
                        ))}
                      </div>
                    </div>
                  ) : filteredSuggestions?.length > 0 ? (
                    <div>
                      <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                        Products matching "{searchTerm}"
                      </div>
                      {filteredSuggestions.map(product => (
                        <Link
                          key={product._id}
                          to={`/product/${product._id}`}
                          onClick={() => { setSearchFocused(false); setSearchTerm(''); }}
                          style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', textDecoration: 'none', borderBottom: '1px solid #f1f5f9' }}
                          onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                          onMouseOut={e => e.currentTarget.style.background = '#fff'}
                        >
                          <img src={product.image} alt={product.name} style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #f1f5f9', padding: '4px' }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>{product.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{product.category}</div>
                          </div>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>{formatPrice(product.price)}</div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '0.95rem' }}>No products found for "{searchTerm}"</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Icons & Actions (Right Flank) */}
          <div className="desktop-only" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '32px' }}>

            <Link to="/notifications" style={{ textDecoration: 'none', color: '#0f172a', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ position: 'relative' }}>
                <span style={{ fontSize: '1.4rem' }}>🔔</span>
                <span style={{ position: 'absolute', top: '-4px', right: '-8px', background: '#ef4444', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '20px', border: '2px solid #fff' }}>2</span>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Alerts</span>
            </Link>



            <Link to="/wishlist" style={{ textDecoration: 'none', color: '#0f172a', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <span style={{ fontSize: '1.4rem' }}>❤️</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Wishlist</span>
              {wishlistItems?.length > 0 && <span style={{ position: 'absolute', top: '-6px', right: '4px', background: '#ef4444', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>{wishlistItems.length}</span>}
            </Link>

            <Link to="/cart" style={{ textDecoration: 'none', color: '#0f172a', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <span style={{ fontSize: '1.4rem' }}>🛒</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Cart</span>
              {cartSummary?.quantity > 0 && <span style={{ position: 'absolute', top: '-6px', right: '-4px', background: '#6366f1', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>{cartSummary.quantity}</span>}
            </Link>

            {user ? (
              <div ref={profileRef} style={{ position: 'relative' }}>
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', transition: 'transform 0.2s' }}
                  onClick={() => setShowDropdown(!showDropdown)}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 'bold' }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Account</span>
                </div>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.15 }}
                      style={{ position: 'absolute', top: '100%', right: 0, marginTop: '16px', background: '#fff', width: '240px', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0', padding: '8px 0', zIndex: 1100 }}
                    >
                      <div style={{ padding: '12px 20px 16px', borderBottom: '1px solid #f1f5f9', marginBottom: '8px' }}>
                        <strong style={{ display: 'block', color: '#0f172a', fontSize: '1rem' }}>{user.name}</strong>
                        <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{user.email}</span>
                      </div>
                      {[
                        { icon: '👤', label: 'My Profile', path: '/profile' },
                        { icon: '📦', label: 'Orders', path: '/orders' },
                        { icon: '❤️', label: 'Wishlist', path: '/wishlist' },
                        { icon: '📍', label: 'Saved Addresses', path: '/profile' }
                      ].map(link => (
                        <Link key={link.label} to={link.path} onClick={() => setShowDropdown(false)} style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', textDecoration: 'none', color: '#334155', gap: '12px', fontSize: '0.95rem', fontWeight: 500 }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                          <span>{link.icon}</span> {link.label}
                        </Link>
                      ))}
                      <div style={{ borderTop: '1px solid #f1f5f9', margin: '8px 0 0', paddingTop: '8px' }}>
                        <button onClick={() => { handleLogout(); setShowDropdown(false); }} style={{ width: '100%', textAlign: 'left', padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontWeight: 600, display: 'flex', gap: '12px', fontSize: '0.95rem' }} onMouseOver={e => e.currentTarget.style.background = '#fef2f2'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                          <span>🚪</span> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none', color: '#0f172a', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <span style={{ fontSize: '1.4rem' }}>👤</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* 3. Category Navigation (Desktop) */}
        <div className="desktop-only" style={{ borderTop: '1px solid #f1f5f9' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', padding: '0 24px', position: 'relative', height: '60px' }}>

            <div
              onClick={() => setShowMegaMenu(!showMegaMenu)}
              ref={megaMenuRef}
              style={{ padding: '0 24px 0 0', height: '100%', cursor: 'pointer', fontWeight: 700, color: showMegaMenu ? '#6366f1' : '#0f172a', display: 'flex', alignItems: 'center', gap: '12px', borderRight: '1px solid #f1f5f9', marginRight: '24px', transition: 'color 0.2s' }}
            >
              <span style={{ fontSize: '1.2rem' }}>{showMegaMenu ? '✕' : '☰'}</span> All Categories
            </div>

            <nav style={{ display: 'flex', alignItems: 'center', gap: '32px', height: '100%' }}>
              {categoryLinks.map(link => {
                const isActive = location.search === link.path.split('?')[1];
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={closeMegaMenu}
                    style={{
                      textDecoration: 'none',
                      color: link.color || (isActive ? '#0f172a' : '#475569'),
                      fontSize: '0.95rem',
                      fontWeight: isActive ? 700 : 600,
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      position: 'relative',
                      transition: 'color 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.color = link.color || '#0f172a'}
                    onMouseOut={e => e.currentTarget.style.color = link.color || (isActive ? '#0f172a' : '#475569')}
                  >
                    {link.name}
                    {isActive && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: '#6366f1', borderRadius: '3px 3px 0 0' }}></div>}
                  </Link>
                )
              })}
            </nav>

            {/* Mega Menu Overlay inside relative container of header */}
            <AnimatePresence>
              {showMegaMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.2 }}
                  style={{ position: 'absolute', top: '100%', left: '24px', right: '24px', background: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', borderTop: 'none', padding: '32px', zIndex: 1200, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', borderRadius: '0 0 16px 16px', cursor: 'default' }}
                >
                  {megaMenuCategories.map((cat, idx) => (
                    <div key={idx}>
                      <h4 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '20px', fontWeight: 800 }}>{cat.title}</h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {cat.items.map(item => (
                          <li key={item}>
                            <Link to={`/products?search=${item}`} onClick={closeMegaMenu} style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#6366f1'} onMouseOut={e => e.currentTarget.style.color = '#64748b'}>{item}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {/* Highlights Column */}
                  <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: 800, margin: 0 }}>Discover</h4>
                    <Link to="/products?search=trending" onClick={closeMegaMenu} style={{ textDecoration: 'none', color: '#4f46e5', fontWeight: 700 }}>★ Featured Products</Link>
                    <Link to="/products?search=deals" onClick={closeMegaMenu} style={{ textDecoration: 'none', color: '#ef4444', fontWeight: 700 }}>🔥 Best Deals</Link>
                    <Link to="/products?search=new" onClick={closeMegaMenu} style={{ textDecoration: 'none', color: '#10b981', fontWeight: 700 }}>✨ New Arrivals</Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </header>

      <div className="mobile-only" style={{ background: '#fff', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <img src={`${import.meta.env.BASE_URL}org_logo.png`} alt="BECS" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
          <div style={{ color: '#0f172a' }}>
            <strong style={{ display: 'block', fontSize: '1.4rem', lineHeight: 1, letterSpacing: '-0.5px', fontWeight: 800 }}>BECS</strong>
            <span style={{ display: 'block', fontSize: '0.65rem', color: '#6366f1', fontWeight: 700, letterSpacing: '2px', marginTop: '2px' }}>STORE</span>
          </div>
        </Link>
      </div>

      {/* 5. Mobile Bottom Navigation Bar */}
      <div className="mobile-only" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '12px 0', zIndex: 999, boxShadow: '0 -4px 10px rgba(0,0,0,0.05)' }}>
        {[
          { icon: '🏠', label: 'Home', path: '/' },
          { icon: '☰', label: 'Categories', action: () => setIsMobileMenuOpen(true) },
          { icon: '❤️', label: 'Wishlist', path: '/wishlist', count: wishlistItems?.length },
          { icon: '🛒', label: 'Cart', path: '/cart', count: cartSummary?.quantity },
          { icon: '👤', label: 'Account', path: user ? '/profile' : '/login' }
        ].map(item => (
          item.path ? (
            <Link key={item.label} to={item.path} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: location.pathname === item.path ? '#6366f1' : '#64748b', position: 'relative' }}>
              <span style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{item.icon}</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>{item.label}</span>
              {item.count > 0 && <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: '#fff', fontSize: '0.65rem', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.count}</span>}
            </Link>
          ) : (
            <button key={item.label} onClick={item.action} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
              <span style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{item.icon}</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>{item.label}</span>
            </button>
          )
        ))}
      </div>

      {/* 6. Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 1100, backdropFilter: 'blur(4px)' }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', duration: 0.3 }}
              style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: '85%', maxWidth: '320px', background: '#fff', zIndex: 1101, display: 'flex', flexDirection: 'column', boxShadow: '20px 0 40px rgba(0,0,0,0.1)' }}
            >
              <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
                <strong style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: 800 }}>Menu</strong>
                <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', fontSize: '1rem', cursor: 'pointer', color: '#0f172a' }}>✕</button>
              </div>

              <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '12px', padding: '0 16px' }}>
                  <span style={{ fontSize: '1rem', opacity: 0.5 }}>🔍</span>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { setIsMobileMenuOpen(false); navigate(`/products?search=${searchTerm}`); } }}
                    style={{ width: '100%', padding: '12px 12px', border: 'none', background: 'transparent', outline: 'none', fontSize: '1rem' }}
                  />
                </div>
              </div>

              <nav style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto' }}>
                <a href={frontendUrl} onClick={(e) => { e.preventDefault(); window.location.href = frontendUrl; }} style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 700, fontSize: '1.1rem', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>Main Website ↗</a>

                <div style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '8px' }}>Categories</div>
                {megaMenuCategories.map(cat => (
                  <Link key={cat.title} to={`/products?search=${cat.title}`} onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#0f172a', textDecoration: 'none', fontWeight: 600, fontSize: '1.1rem' }}>{cat.title}</Link>
                ))}
              </nav>

              <div style={{ padding: '24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                {!user ? (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'block', textAlign: 'center', background: '#0f172a', color: '#fff', textDecoration: 'none', padding: '16px', borderRadius: '12px', fontWeight: 700 }}>Sign In / Register</Link>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 'bold' }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem' }}>{user.name}</div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>{user.email}</div>
                      </div>
                    </div>
                    <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} style={{ width: '100%', padding: '14px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>Logout</button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
