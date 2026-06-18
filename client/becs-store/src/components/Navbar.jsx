import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import API, { fetchProducts, fetchProduct, createOrder, fetchMyOrders, login as apiLogin, register as apiRegister, createPaymentIntent } from '../api';

function Navbar() {
  const { cartSummary, user, handleLogout, wishlistItems } = React.useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/?search=${searchTerm}`);
    }
  };

  return (
    <header className="shop-topbar" style={{ padding: '16px 0', borderBottom: '1px solid var(--line)', background: '#fff', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '40px' }}>
        <Link className="shop-brand" to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="BECS Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
          <div style={{ color: 'var(--navy)' }}>
            <strong style={{ display: 'block', fontSize: '1.2rem', lineHeight: 1.2 }}>BECS</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Store</span>
          </div>
        </Link>
        
        <div style={{ flex: 1, maxWidth: '600px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '8px', padding: '0 16px', border: '1px solid transparent', transition: 'border 0.2s ease' }} onFocus={(e) => e.currentTarget.style.border = '1px solid var(--accent)'} onBlur={(e) => e.currentTarget.style.border = '1px solid transparent'}>
            <span style={{ fontSize: '1.2rem', color: 'var(--muted)', marginRight: '8px' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Search products, categories, brands..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              onKeyDown={handleSearch}
              style={{ width: '100%', padding: '12px 0', border: 'none', background: 'transparent', outline: 'none', fontSize: '1rem' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/wishlist" style={{ textDecoration: 'none', color: 'var(--navy)', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>♡</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Wishlist</span>
            {wishlistItems.length > 0 && <span style={{ position: 'absolute', top: '-6px', right: '-4px', background: 'var(--accent)', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{wishlistItems.length}</span>}
          </Link>
          
          <Link to="/orders" style={{ textDecoration: 'none', color: 'var(--navy)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>📦</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Orders</span>
          </Link>

          <Link to="/cart" style={{ textDecoration: 'none', color: 'var(--navy)', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>🛒</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Cart</span>
            {cartSummary.quantity > 0 && <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--accent)', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartSummary.quantity}</span>}
          </Link>

          {user ? (
            <div style={{ position: 'relative' }}>
              <div 
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', marginBottom: '2px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 'bold', marginBottom: '2px' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Profile</span>
              </div>
              
              {showDropdown && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '16px', background: '#fff', width: '260px', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.12)', border: '1px solid var(--line)', padding: '16px 0', zIndex: 110 }}>
                  <div style={{ padding: '0 20px 16px', borderBottom: '1px solid var(--line)', marginBottom: '8px' }}>
                    <strong style={{ display: 'block', color: 'var(--navy)', fontSize: '1.1rem' }}>{user.name}</strong>
                    <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{user.email}</span>
                  </div>
                  <Link to="/profile" onClick={() => setShowDropdown(false)} style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', textDecoration: 'none', color: 'var(--text)', gap: '12px', fontSize: '0.95rem' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}><span>👤</span> My Profile</Link>
                  <Link to="/orders" onClick={() => setShowDropdown(false)} style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', textDecoration: 'none', color: 'var(--text)', gap: '12px', fontSize: '0.95rem' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}><span>📦</span> Orders</Link>
                  <Link to="/wishlist" onClick={() => setShowDropdown(false)} style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', textDecoration: 'none', color: 'var(--text)', gap: '12px', fontSize: '0.95rem' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}><span>❤️</span> Wishlist</Link>
                  <Link to="/cart" onClick={() => setShowDropdown(false)} style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', textDecoration: 'none', color: 'var(--text)', gap: '12px', fontSize: '0.95rem' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}><span>🛒</span> Cart</Link>
                  <Link to="/profile" onClick={() => setShowDropdown(false)} style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', textDecoration: 'none', color: 'var(--text)', gap: '12px', fontSize: '0.95rem' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}><span>📍</span> Saved Addresses</Link>
                  <Link to="/notifications" onClick={() => setShowDropdown(false)} style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', textDecoration: 'none', color: 'var(--text)', gap: '12px', fontSize: '0.95rem' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}><span>🔔</span> Notifications</Link>
                  <div style={{ borderTop: '1px solid var(--line)', margin: '8px 0 0', paddingTop: '8px' }}>
                    <button onClick={() => { handleLogout(); setShowDropdown(false); }} style={{ width: '100%', textAlign: 'left', padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontWeight: 600, display: 'flex', gap: '12px', fontSize: '0.95rem' }} onMouseOver={e => e.currentTarget.style.background = '#fef2f2'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}><span>🚪</span> Logout</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="action-button action-button--solid" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', height: '40px', padding: '0 24px', borderRadius: '20px', fontSize: '0.95rem' }}>Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
