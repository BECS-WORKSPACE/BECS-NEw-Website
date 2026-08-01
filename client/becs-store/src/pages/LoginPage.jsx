import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

function LoginPage() {
  const { handleLogin } = React.useContext(ShopContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);
    
    const result = await handleLogin({ email, password });
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 16px', background: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
      
      {/* Page Background */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(37,99,235,0.05) 0%, rgba(248,250,252,0) 70%)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(79,70,229,0.05) 0%, rgba(248,250,252,0) 70%)', borderRadius: '50%', filter: 'blur(80px)' }}></div>
        <div style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.5 }}></div>
      </div>

      {/* Main Authentication Container */}
      <div 
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1400px', minHeight: '600px', background: '#fff', borderRadius: '28px', boxShadow: '0 30px 80px rgba(0,0,0,0.12)', display: 'flex', overflow: 'hidden', flexWrap: 'wrap', animation: 'fadeInUp 0.5s ease-out' }}
      >
        
        {/* Left Branding Panel */}
        <div className="desktop-only" style={{ flex: '0 0 45%', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)', position: 'relative', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#fff', overflow: 'hidden' }}>
          
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'url(/images/circuit_pattern.png) center/cover', opacity: 0.08, mixBlendMode: 'overlay' }}></div>
          <div style={{ position: 'absolute', top: '15%', left: '15%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', filter: 'blur(40px)', animation: 'float1 6s infinite ease-in-out' }}></div>
          <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(56,189,248,0.2) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', filter: 'blur(50px)', animation: 'float2 7s infinite ease-in-out' }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-1px', marginBottom: '24px' }}>
              Build.<br/>
              <span style={{ background: 'linear-gradient(to right, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Innovate.</span><br/>
              Create.
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '32px', fontWeight: 500, maxWidth: '400px' }}>
              Everything engineers need, from Arduino to Industrial Automation. Trusted by thousands of students, makers, and industries.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '40px' }}>
              {[
                { text: 'Exclusive Discounts' },
                { text: 'Secure Checkout' },
                { text: 'Fast Delivery' },
                { text: 'Genuine Components' },
              ].map(item => (
                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '14px 16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', transition: 'transform 0.2s, background 0.2s', cursor: 'default' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}>
                  <span style={{ color: '#38bdf8', fontSize: '1.1rem', fontWeight: 900 }}>✓</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.text}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '32px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '32px' }}>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>25K+</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Products</div>
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>150+</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Brands</div>
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>50K+</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Customers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Authentication Panel */}
        <div className="auth-panel-right" style={{ flex: '1 1 55%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
          <div style={{ width: '100%', maxWidth: '480px' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <img src="/logo.png" alt="BECS" style={{ width: '56px', height: 'auto', marginBottom: '16px' }} />
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '8px' }}>Welcome Back</h2>
              <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: 500 }}>Sign in to continue your journey.</p>
            </div>

            <div className="auth-btn-group">
              <button style={{ flex: 1, height: '48px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '0.95rem', fontWeight: 600, color: '#1e293b', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.05)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)'; }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" style={{ width: '20px' }} />
                Google
              </button>
              <button style={{ flex: 1, height: '48px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '0.95rem', fontWeight: 600, color: '#1e293b', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.05)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)'; }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub" style={{ width: '20px' }} />
                GitHub
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
              <span style={{ padding: '0 16px', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>OR CONTINUE WITH EMAIL</span>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
            </div>

            {error && (
              <div style={{ padding: '16px', background: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#991b1b', borderRadius: '8px', marginBottom: '24px', fontSize: '0.95rem', fontWeight: 600, animation: 'fadeIn 0.3s ease-out' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '1.2rem' }}>✉</span>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    disabled={loading}
                    style={{ width: '100%', height: '48px', padding: '0 16px 0 44px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', color: '#0f172a', outline: 'none', transition: 'all 0.2s', background: loading ? '#f8fafc' : '#fff' }} 
                    placeholder="name@example.com"
                    onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>Password</label>
                  <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: '#2563eb', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#4f46e5'} onMouseOut={e => e.currentTarget.style.color = '#2563eb'}>Forgot password?</Link>
                </div>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '1.2rem' }}>🔒</span>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    disabled={loading}
                    style={{ width: '100%', height: '48px', padding: '0 44px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', color: '#0f172a', outline: 'none', transition: 'all 0.2s', background: loading ? '#f8fafc' : '#fff' }} 
                    placeholder="••••••••"
                    onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px', fontSize: '1.1rem' }}>
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={{ width: '100%', height: '48px', background: loading ? '#94a3b8' : 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: loading ? 'none' : '0 10px 25px rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseOver={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseOut={e => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
                onMouseDown={e => !loading && (e.currentTarget.style.transform = 'scale(0.98)')}
                onMouseUp={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
              >
                {loading ? (
                  <span style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid rgba(255,255,255,0.3)', borderRadius: '50%', borderTopColor: '#fff', animation: 'spin 1s ease-in-out infinite' }}></span>
                ) : 'Sign In'}
              </button>
            </form>

            <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.95rem', color: '#64748b', fontWeight: 500 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#4f46e5'} onMouseOut={e => e.currentTarget.style.color = '#2563eb'}>Create an account</Link>
            </div>

          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes float1 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        @keyframes float2 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(15px); } }
      `}} />
    </div>
  );
}

export default LoginPage;
