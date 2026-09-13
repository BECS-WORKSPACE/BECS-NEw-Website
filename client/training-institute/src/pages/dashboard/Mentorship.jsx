import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

const Mentorship = () => {
  const { user } = useAuth();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call for mentorship request
      // In a real app, this would hit a /api/mentorship endpoint
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2.2rem', fontFamily: 'Outfit', color: 'var(--navy)', margin: '0 0 8px 0', fontWeight: 800 }}>1-on-1 Mentorship</h2>
        <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 0 }}>Get personalized guidance from industry experts and top educators.</p>
      </div>

      {success ? (
        <div style={{ background: 'white', padding: '40px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎉</div>
          <h3 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '8px' }}>Request Submitted</h3>
          <p style={{ color: '#64748b' }}>A mentor will be assigned to you shortly. You will receive an email notification.</p>
        </div>
      ) : (
        <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.3rem', color: '#1e293b', marginBottom: '16px' }}>Request a Session</h3>
          <form onSubmit={handleRequest} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Area of Guidance</label>
              <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} required>
                <option value="">Select Topic...</option>
                <option value="career">Career Planning</option>
                <option value="exam">Exam Strategy</option>
                <option value="doubt">Subject Specific Doubts</option>
                <option value="motivation">Motivation & Stress Management</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Additional Context (Optional)</label>
              <textarea rows="4" placeholder="What specific challenges are you facing?" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}></textarea>
            </div>
            <button type="submit" disabled={loading} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Submitting...' : 'Request Mentor'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Mentorship;
