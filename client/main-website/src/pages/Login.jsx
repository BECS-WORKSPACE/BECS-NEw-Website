import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, register } from '../api';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const { data } = await login({ email, password });
        localStorage.setItem('becs_user', JSON.stringify(data));
      } else {
        const { data } = await register({ name, email, password });
        localStorage.setItem('becs_user', JSON.stringify(data));
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="auth-page">
      <Link to="/" className="back-link">← Back to Home</Link>
      
      <div className="auth-container">
        <div className="auth-visual">
          <div className="auth-brand" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img src="/logo.png" alt="BECS Logo" style={{ width: '75px', height: '75px', objectFit: 'contain' }} />
            <span className="brand-name" style={{ fontSize: '2.5rem', color: '#fff' }}>BECS</span>
          </div>
          <h2>{isLogin ? 'Welcome Back!' : 'Join Us Today!'}</h2>
          <p>
            {isLogin 
              ? 'Access your unified electronics dashboard to manage projects, orders, and consultancy services.' 
              : 'Create an account to unlock premium electronics consultancy, products, and automation solutions.'}
          </p>
          <div className="auth-features">
            <div className="auth-feature-item">✓ 24/7 Priority Support</div>
            <div className="auth-feature-item">✓ Premium Component Access</div>
            <div className="auth-feature-item">✓ Real-time Project Tracking</div>
          </div>
        </div>

        <div className="auth-form-wrapper">
          <div className="auth-header">
            <h3>{isLogin ? 'Sign In' : 'Create Account'}</h3>
            <p>{isLogin ? 'Please enter your credentials to access your account.' : 'Fill in the details below to get started.'}</p>
          </div>

          {error && <div className="flash-message" style={{ background: '#fee2e2', color: '#991b1b', marginBottom: '20px', padding: '10px', borderRadius: '8px', fontSize: '0.9rem' }}>{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
              </div>
            )}
            
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            {isLogin && (
              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" /> Remember me
                </label>
                <a href="#" className="forgot-password">Forgot Password?</a>
              </div>
            )}

            <button type="submit" className="pill-button pill-button--solid auth-submit">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="auth-footer">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button className="auth-toggle-btn" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
