import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login, register } from '../api';

const Login = () => {
  const { setUser, user } = useAuth();
  const navigate = useNavigate();
  const [authRole, setAuthRole] = useState('student');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (user) {
      if (location.state?.from) {
        navigate(location.state.from, { state: { course: location.state.course } });
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate, location]);
  
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let authenticatedUser;
      
      if (isRegistering) {
        authenticatedUser = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: authRole // Backend should assign the correct Object ID or handle legacy string
        });
      } else {
        authenticatedUser = await login({
          email: formData.email,
          password: formData.password
        });
      }
      
      if (authRole === 'teacher' && authenticatedUser.role !== 'teacher' && authenticatedUser.legacyRole !== 'teacher') {
        throw new Error("You are not authorized as a Teacher.");
      }
      
      setUser(authenticatedUser);
      localStorage.setItem('becs_user', JSON.stringify(authenticatedUser));
      
      if (location.state?.from) {
        navigate(location.state.from, { state: { course: location.state.course } });
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      alert(err.message || (isRegistering ? 'Registration failed' : 'Authentication failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', overflow: 'hidden', background: '#f8fafc' }}>
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(230,34,59,0.08) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '30vw', height: '30vw', background: 'radial-gradient(circle, rgba(30,41,59,0.08) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', zIndex: 0 }}></div>
      
      <div className="auth-card" style={{ display: 'flex', width: '100%', maxWidth: '1000px', minHeight: '600px', background: 'white', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', overflow: 'hidden', zIndex: 1, animation: 'fadeInUp 0.6s ease-out' }}>
        
        <div className="auth-left-panel" style={{ flex: 1, position: 'relative', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px', color: 'white' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15, mixBlendMode: 'overlay' }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', fontSize: '2rem', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.2)' }}>🎓</div>
            <h1 style={{ fontSize: '2.5rem', fontFamily: 'Outfit', fontWeight: 800, marginBottom: '16px', lineHeight: 1.2 }}>Welcome to EduVerse</h1>
            <p style={{ fontSize: '1rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '32px' }}>Experience India's most advanced learning platform. Access your courses, mock tests, and live classes all in one place.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></div><span style={{ fontSize: '0.95rem' }}>Premium Content</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></div><span style={{ fontSize: '0.95rem' }}>Live Mentorship</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></div><span style={{ fontSize: '0.95rem' }}>Advanced Analytics</span></div>
            </div>
          </div>
        </div>
        
        <div className="auth-right-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 60px', background: 'white' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '2rem', fontFamily: 'Outfit', color: '#1e293b', margin: '0 0 8px 0' }}>
              {isRegistering ? 'Create your account' : 'Log in to your account'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {isRegistering ? 'Sign up to start your learning journey.' : 'Enter your credentials provided by the administration.'}
            </p>
          </div>

          <div style={{ display: 'flex', position: 'relative', background: '#f1f5f9', padding: '4px', borderRadius: '12px', marginBottom: '32px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ position: 'absolute', top: '4px', bottom: '4px', left: authRole === 'student' ? '4px' : '50%', width: 'calc(50% - 4px)', background: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 1 }}></div>
            <button type="button" onClick={() => setAuthRole('student')} style={{ flex: 1, padding: '12px', background: 'transparent', border: 'none', color: authRole === 'student' ? '#1e293b' : 'var(--text-muted)', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', position: 'relative', zIndex: 2, transition: 'color 0.3s' }}>Student Portal</button>
            <button type="button" onClick={() => setAuthRole('teacher')} style={{ flex: 1, padding: '12px', background: 'transparent', border: 'none', color: authRole === 'teacher' ? '#1e293b' : 'var(--text-muted)', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', position: 'relative', zIndex: 2, transition: 'color 0.3s' }}>Teacher Portal</button>
          </div>

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {isRegistering && (
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Full Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Enter your full name" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#f8fafc', fontSize: '0.95rem', outline: 'none', transition: 'border 0.3s', color: '#1e293b' }} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              </div>
            )}
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Email Address</label>
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder={`Enter your ${authRole} email`} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#f8fafc', fontSize: '0.95rem', outline: 'none', transition: 'border 0.3s', color: '#1e293b' }} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Password</label>
              <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••••" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#f8fafc', fontSize: '0.95rem', outline: 'none', transition: 'border 0.3s', color: '#1e293b' }} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: 500 }}>Forgot password?</span>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-solid-lg" style={{ marginTop: '12px', padding: '14px', fontSize: '1.05rem', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 10px 25px rgba(230, 34, 59, 0.3)', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }}>
              {isLoading ? <span style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s infinite linear' }} /> : (isRegistering ? 'Create Account' : 'Secure Log In')}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '32px' }}>
            {isRegistering ? (
              <>Already have an account? <span onClick={() => setIsRegistering(false)} style={{ color: '#1e293b', fontWeight: 600, cursor: 'pointer' }}>Log In</span></>
            ) : (
              <>Don't have an account? <span onClick={() => setIsRegistering(true)} style={{ color: '#1e293b', fontWeight: 600, cursor: 'pointer' }}>Sign up</span></>
            )}
          </p>
        </div>
      </div>
      <style>
        {`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          
          /* Responsive Design Rules */
          @media (max-width: 900px) {
            .auth-card {
              flex-direction: column !important;
              max-width: 500px !important;
              min-height: auto !important;
            }
            .auth-left-panel {
              padding: 30px 24px !important;
              text-align: center;
            }
            .auth-left-panel h1 {
              font-size: 2rem !important;
            }
            .auth-left-panel p, .auth-left-panel .gap-16px {
              display: none !important;
            }
            .auth-right-panel {
              padding: 40px 24px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Login;
