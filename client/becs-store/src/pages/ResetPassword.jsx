import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const getPasswordStrength = () => {
    if (!password) return { label: 'None', score: 0, color: '#e2e8f0' };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^A-Za-z0-9]/)) score++;
    
    if (score <= 1) return { label: 'Weak', score: 1, color: '#ef4444' };
    if (score === 2) return { label: 'Fair', score: 2, color: '#f59e0b' };
    if (score === 3) return { label: 'Good', score: 3, color: '#10b981' };
    return { label: 'Strong', score: 4, color: '#10b981' };
  };
  const strength = getPasswordStrength();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    }, 1500);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 160px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
      
      {/* Page Background */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(37,99,235,0.05) 0%, rgba(248,250,252,0) 70%)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(79,70,229,0.05) 0%, rgba(248,250,252,0) 70%)', borderRadius: '50%', filter: 'blur(80px)' }}></div>
        <div style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.5 }}></div>
      </div>

      {/* Main Authentication Container */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }} 
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1400px', minHeight: '760px', background: '#fff', borderRadius: '28px', boxShadow: '0 30px 80px rgba(0,0,0,0.12)', display: 'flex', overflow: 'hidden', flexWrap: 'wrap' }}
      >
        
        {/* Left Branding Panel */}
        <div className="desktop-only" style={{ flex: '0 0 45%', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)', position: 'relative', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#fff', overflow: 'hidden' }}>
          
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'url(/images/circuit_pattern.png) center/cover', opacity: 0.08, mixBlendMode: 'overlay' }}></div>
          <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} style={{ position: 'absolute', top: '15%', left: '15%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', filter: 'blur(40px)' }}></motion.div>
          <motion.div animate={{ y: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }} style={{ position: 'absolute', bottom: '20%', right: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(56,189,248,0.2) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', filter: 'blur(50px)' }}></motion.div>
          
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '5rem', marginBottom: '24px' }}>🔑</div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-1px', marginBottom: '24px' }}>
              Set a new<br/>
              <span style={{ background: 'linear-gradient(to right, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Password.</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#cbd5e1', lineHeight: 1.6, fontWeight: 500, maxWidth: '400px', margin: '0 auto' }}>
              Make sure it's at least 8 characters long and includes a number or symbol.
            </p>
          </div>
        </div>

        {/* Right Authentication Panel */}
        <div style={{ flex: '1 1 55%', padding: '80px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
          <div style={{ width: '100%', maxWidth: '480px' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <img src="/logo.png" alt="BECS" style={{ width: '64px', height: 'auto', marginBottom: '24px' }} />
              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '12px' }}>Reset Password</h2>
              <p style={{ color: '#64748b', fontSize: '1.05rem', fontWeight: 500 }}>Your identity has been verified.</p>
            </div>

            {success ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '32px 16px', background: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 24px' }}>✓</div>
                <h3 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '12px', fontWeight: 700 }}>Password Reset Successfully</h3>
                <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '1.05rem' }}>Redirecting you to the login page...</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ padding: '16px', background: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#991b1b', borderRadius: '8px', marginBottom: '24px', fontSize: '0.95rem', fontWeight: 600 }}>
                    {error}
                  </motion.div>
                )}

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>New Password</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '1.2rem' }}>🔒</span>
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading}
                      style={{ width: '100%', height: '56px', padding: '0 48px', borderRadius: '14px', border: '1px solid #cbd5e1', fontSize: '1.05rem', color: '#0f172a', outline: 'none', transition: 'all 0.2s', background: loading ? '#f8fafc' : '#fff' }} 
                      placeholder="••••••••"
                      onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px', fontSize: '1.2rem' }}>
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>

                  {/* Advanced Password Strength Blocks */}
                  <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '4px', flex: 1, marginRight: '16px' }}>
                      {[1, 2, 3, 4].map(idx => (
                        <div key={idx} style={{ height: '6px', flex: 1, borderRadius: '3px', background: password.length > 0 && strength.score >= idx ? strength.color : '#e2e8f0', transition: 'background 0.3s ease' }}></div>
                      ))}
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: password.length > 0 ? strength.color : '#94a3b8', width: '50px', textAlign: 'right' }}>
                      {strength.label}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '40px' }}>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Confirm New Password</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '1.2rem' }}>🔒</span>
                    <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={loading}
                      style={{ width: '100%', height: '56px', padding: '0 48px', borderRadius: '14px', border: '1px solid #cbd5e1', fontSize: '1.05rem', color: '#0f172a', outline: 'none', transition: 'all 0.2s', background: loading ? '#f8fafc' : '#fff' }} 
                      placeholder="••••••••"
                      onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  style={{ width: '100%', height: '56px', background: loading ? '#94a3b8' : 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)', color: '#fff', border: 'none', borderRadius: '14px', fontSize: '1.1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: loading ? 'none' : '0 10px 25px rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onMouseOver={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseOut={e => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
                  onMouseDown={e => !loading && (e.currentTarget.style.transform = 'scale(0.98)')}
                  onMouseUp={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                >
                  {loading ? (
                    <span style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid rgba(255,255,255,0.3)', borderRadius: '50%', borderTopColor: '#fff', animation: 'spin 1s ease-in-out infinite' }}></span>
                  ) : 'Reset Password'}
                </button>
              </form>
            )}

          </div>
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}

export default ResetPassword;
