import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Counselling = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ type: 'career', date: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/users/counselling/book', formData);
      setSuccess(true);
    } catch (err) {
      alert('Failed to book session');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: '#f8fafc' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', maxWidth: '500px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>✅</div>
          <h2 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '16px' }}>Booking Confirmed</h2>
          <p style={{ color: '#475569', marginBottom: '24px' }}>Your {formData.type} counselling session has been requested for {new Date(formData.date).toLocaleDateString()}. Our team will contact you shortly.</p>
          <button onClick={() => navigate('/dashboard')} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '80vh', padding: '40px 20px', background: '#f8fafc', display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: '600px', width: '100%', background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '2rem', color: '#1e293b', marginBottom: '8px' }}>Book a Counselling Session</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Get expert guidance on your career path or receive psychological support from our trained professionals.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Session Type</label>
            <select 
              value={formData.type} 
              onChange={e => setFormData({ ...formData, type: e.target.value })}
              style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', fontSize: '1rem' }}
            >
              <option value="career">Career Counselling</option>
              <option value="psychological">Psychological Counselling</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Preferred Date</label>
            <input 
              type="date" 
              required
              min={new Date().toISOString().split('T')[0]}
              value={formData.date} 
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
            />
          </div>

          <button type="submit" disabled={isLoading} style={{ marginTop: '16px', background: 'var(--primary)', color: 'white', border: 'none', padding: '16px', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 600 }}>
            {isLoading ? 'Processing...' : 'Book Session'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Counselling;
