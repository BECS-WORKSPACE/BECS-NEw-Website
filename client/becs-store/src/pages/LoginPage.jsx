import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import API, { fetchProducts, fetchProduct, createOrder, fetchMyOrders, login as apiLogin, register as apiRegister, createPaymentIntent } from '../api';

function LoginPage() {
  const { handleLogin, handleRegister } = React.useContext(ShopContext);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    let result;
    if (isLogin) {
      result = await handleLogin({ email, password });
    } else {
      result = await handleRegister({ name, email, password });
    }

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', margin: '100px auto' }}>
      <div className="panel" style={{ padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="BECS Logo" style={{ width: '85px', height: '85px', objectFit: 'contain' }} />
        </div>
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>{isLogin ? 'Login to BECS' : 'Create Account'}</h2>
        {error && <div className="flash-message" style={{ background: '#fee2e2', color: '#991b1b', marginBottom: '20px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--line)' }} placeholder="John Doe" />
            </div>
          )}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--line)' }} placeholder="john@example.com" />
          </div>
          <div className="form-group" style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--line)' }} placeholder="••••••••" />
          </div>
          <button type="submit" className="action-button action-button--solid action-button--full" style={{ minHeight: '50px' }}>
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <div style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-light)' }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 'bold', marginLeft: '8px', cursor: 'pointer' }}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
