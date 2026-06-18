import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import API, { fetchProducts, fetchProduct, createOrder, fetchMyOrders, login as apiLogin, register as apiRegister, createPaymentIntent } from '../api';

function Profile() {
  const { user, setUser, handleLogout, addresses, setAddresses } = React.useContext(ShopContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  
  const presetAvatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Nala',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Missy',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam',
  ];

  const handleUpdateAvatar = (url) => {
    setUser({ ...user, avatar: url });
    setShowAvatarModal(false);
    setCustomAvatarUrl('');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container app-shell" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '40px', alignItems: 'start' }}>
        
        {/* Account Sidebar */}
        <aside style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid var(--line)' }}>
             {user.avatar ? (
               <img src={user.avatar} alt="User Avatar" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--line)' }} />
             ) : (
               <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent-deep))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 'bold' }}>
                 {user.name.charAt(0).toUpperCase()}
               </div>
             )}
             <div>
               <strong style={{ display: 'block', fontSize: '1.2rem', color: 'var(--navy)' }}>{user.name}</strong>
               <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{user.email}</span>
             </div>
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button onClick={() => setActiveTab('profile')} style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '8px', background: activeTab === 'profile' ? 'rgba(0, 86, 210, 0.05)' : 'transparent', color: activeTab === 'profile' ? 'var(--accent)' : 'var(--text)', fontWeight: activeTab === 'profile' ? 700 : 500, border: 'none', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '12px' }}><span>👤</span> My Profile</button>
            <button onClick={() => navigate('/orders')} style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '8px', background: 'transparent', color: 'var(--text)', fontWeight: 500, border: 'none', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '12px' }}><span>📦</span> My Orders</button>
            <button onClick={() => setActiveTab('addresses')} style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '8px', background: activeTab === 'addresses' ? 'rgba(0, 86, 210, 0.05)' : 'transparent', color: activeTab === 'addresses' ? 'var(--accent)' : 'var(--text)', fontWeight: activeTab === 'addresses' ? 700 : 500, border: 'none', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '12px' }}><span>📍</span> Saved Addresses</button>
            <button onClick={() => setActiveTab('cards')} style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '8px', background: activeTab === 'cards' ? 'rgba(0, 86, 210, 0.05)' : 'transparent', color: activeTab === 'cards' ? 'var(--accent)' : 'var(--text)', fontWeight: activeTab === 'cards' ? 700 : 500, border: 'none', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '12px' }}><span>💳</span> Saved Cards & Wallet</button>
            <button onClick={() => navigate('/notifications')} style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '8px', background: 'transparent', color: 'var(--text)', fontWeight: 500, border: 'none', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '12px' }}><span>🔔</span> Notifications</button>
            <div style={{ height: '1px', background: 'var(--line)', margin: '10px 0' }}></div>
            <button onClick={handleLogout} style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '8px', background: 'transparent', color: '#ef4444', fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '12px' }}><span>🚪</span> Logout</button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <div style={{ padding: '30px', border: '1px solid var(--line)', borderRadius: '16px', minHeight: '600px' }}>
          {activeTab === 'profile' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '16px', borderBottom: '1px solid var(--line)' }}>
                <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Personal Information</h2>
                <button onClick={() => setShowAvatarModal(true)} className="action-button action-button--ghost" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Edit Avatar</button>
              </div>

              {showAvatarModal && (
                <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--line)', marginBottom: '30px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Choose your Avatar</h3>
                    <button onClick={() => setShowAvatarModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '16px' }}>
                    {presetAvatars.map((url, idx) => (
                      <img 
                        key={idx} 
                        src={url} 
                        alt="Preset Avatar" 
                        onClick={() => handleUpdateAvatar(url)}
                        style={{ width: '60px', height: '60px', borderRadius: '50%', cursor: 'pointer', border: user.avatar === url ? '3px solid var(--accent)' : '1px solid var(--line)', background: '#fff', flexShrink: 0 }} 
                      />
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input 
                      type="text" 
                      placeholder="Or paste an image URL..." 
                      value={customAvatarUrl} 
                      onChange={(e) => setCustomAvatarUrl(e.target.value)} 
                      style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--line)' }}
                    />
                    <button 
                      onClick={() => { if(customAvatarUrl) handleUpdateAvatar(customAvatarUrl); }} 
                      className="action-button action-button--solid" 
                      style={{ padding: '0 20px' }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '8px' }}>Full Name</label>
                  <input type="text" value={user.name} readOnly style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--line)', background: '#f8fafc', fontSize: '1rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '8px' }}>Email Address</label>
                  <input type="email" value={user.email} readOnly style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--line)', background: '#f8fafc', fontSize: '1rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '8px' }}>Phone Number</label>
                  <input type="tel" placeholder="+91 xxxxx xxxxx" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '1rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '8px' }}>Date of Birth</label>
                  <input type="date" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '1rem' }} />
                </div>
              </div>
              <button className="action-button action-button--solid" style={{ marginTop: '40px', padding: '12px 30px' }}>Save Changes</button>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '16px', borderBottom: '1px solid var(--line)' }}>
                <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Saved Addresses</h2>
                <button className="action-button action-button--ghost" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>+ Add New Address</button>
              </div>
              
              {addresses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📍</div>
                  <h3 style={{ margin: '0 0 10px', fontSize: '1.2rem' }}>No Addresses Saved</h3>
                  <p style={{ color: 'var(--muted)' }}>You haven't saved any addresses yet.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  {addresses.map((addr, idx) => (
                    <div key={addr.id} style={{ border: '1px solid var(--line)', borderRadius: '12px', padding: '20px', position: 'relative' }}>
                      {idx === 0 && <span style={{ position: 'absolute', top: '20px', right: '20px', background: '#f1f5f9', color: 'var(--navy)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>Default</span>}
                      <h4 style={{ margin: '0 0 12px', fontSize: '1.1rem' }}>{addr.name}</h4>
                      <p style={{ margin: '0 0 16px', color: 'var(--muted)', lineHeight: '1.5', fontSize: '0.95rem' }}>
                        {addr.address}<br />
                        {addr.city}, {addr.state} - {addr.pincode}<br />
                        {addr.phone}
                      </p>
                      <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
                        <button style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', padding: 0 }}>Edit</button>
                        <button style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, cursor: 'pointer', padding: 0 }} onClick={() => setAddresses(prev => prev.filter(a => a.id !== addr.id))}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'cards' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '16px', borderBottom: '1px solid var(--line)' }}>
                <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Saved Cards & Wallets</h2>
                <button className="action-button action-button--ghost" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>+ Add New Card</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: 'white', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
                  <h4 style={{ margin: '0 0 24px', fontSize: '1.2rem', fontWeight: 500, letterSpacing: '2px' }}>**** **** **** 4567</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Name on Card</span>
                      <span style={{ fontSize: '1rem', textTransform: 'uppercase' }}>{user.name}</span>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Expires</span>
                      <span style={{ fontSize: '1rem' }}>12/28</span>
                    </div>
                  </div>
                </div>

                <div style={{ border: '1px solid var(--line)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>UPI</div>
                    <div>
                      <h4 style={{ margin: '0 0 4px', fontSize: '1rem' }}>{user.name}</h4>
                      <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>{user.email.split('@')[0]}@oksbi</p>
                    </div>
                  </div>
                  <button style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, cursor: 'pointer', textAlign: 'left', padding: 0 }}>Remove</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
