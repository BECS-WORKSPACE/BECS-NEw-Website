import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const inputs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your email';

  useEffect(() => {
    const timer = countdown > 0 && setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    setLoading(true);
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      navigate('/reset-password');
    }, 1500);
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setCountdown(60);
    // Add real resend logic here later
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
            <div style={{ fontSize: '5rem', marginBottom: '24px' }}>🛡️</div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-1px', marginBottom: '24px' }}>
              Verify your<br/>
              <span style={{ background: 'linear-gradient(to right, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Identity.</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#cbd5e1', lineHeight: 1.6, fontWeight: 500, maxWidth: '400px', margin: '0 auto' }}>
              We've sent a one-time passcode to ensure it's really you.
            </p>
          </div>
        </div>

        {/* Right Authentication Panel */}
        <div style={{ flex: '1 1 55%', padding: '80px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
          <div style={{ width: '100%', maxWidth: '480px' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <img src="/logo.png" alt="BECS" style={{ width: '64px', height: 'auto', marginBottom: '24px' }} />
              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '12px' }}>Check Your Email</h2>
              <p style={{ color: '#64748b', fontSize: '1.05rem', fontWeight: 500, lineHeight: 1.5 }}>
                We've sent a 6-digit verification code to<br/>
                <strong style={{ color: '#0f172a' }}>{email}</strong>
              </p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ padding: '16px', background: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#991b1b', borderRadius: '8px', marginBottom: '24px', fontSize: '0.95rem', fontWeight: 600 }}>
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '40px' }}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    disabled={loading}
                    style={{
                      width: '60px',
                      height: '68px',
                      fontSize: '1.6rem',
                      fontWeight: 700,
                      textAlign: 'center',
                      border: '1px solid #cbd5e1',
                      borderRadius: '14px',
                      color: '#0f172a',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: loading ? '#f8fafc' : '#fff'
                    }}
                    onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
                  />
                ))}
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={{ width: '100%', height: '56px', background: loading ? '#94a3b8' : 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)', color: '#fff', border: 'none', borderRadius: '14px', fontSize: '1.1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: loading ? 'none' : '0 10px 25px rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}
                onMouseOver={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseOut={e => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
                onMouseDown={e => !loading && (e.currentTarget.style.transform = 'scale(0.98)')}
                onMouseUp={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
              >
                {loading ? (
                  <span style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid rgba(255,255,255,0.3)', borderRadius: '50%', borderTopColor: '#fff', animation: 'spin 1s ease-in-out infinite' }}></span>
                ) : 'Verify Code'}
              </button>
              
              <div style={{ textAlign: 'center', fontSize: '1.05rem', color: '#64748b', fontWeight: 500 }}>
                Didn't receive the code?{' '}
                {countdown > 0 ? (
                  <span style={{ color: '#94a3b8' }}>Resend in {countdown}s</span>
                ) : (
                  <button type="button" onClick={handleResend} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, cursor: 'pointer', padding: 0, fontSize: '1.05rem' }} onMouseOver={e => e.currentTarget.style.color = '#4f46e5'} onMouseOut={e => e.currentTarget.style.color = '#2563eb'}>
                    Resend Code
                  </button>
                )}
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <Link to="/login" style={{ color: '#64748b', fontSize: '1.05rem', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#0f172a'} onMouseOut={e => e.currentTarget.style.color = '#64748b'}>
                  Back to Login
                </Link>
              </div>
            </form>

          </div>
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}

export default VerifyOTP;
