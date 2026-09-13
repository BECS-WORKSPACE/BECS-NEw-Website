import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { completeProfile } from '../api';

const CompleteProfile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    highestEducation: '',
    preparingFor: '',
    address: '',
    pinCode: '',
    city: '',
    state: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedProfile = await completeProfile(formData);
      
      // Update local storage and context
      const updatedUser = { ...user, profileCompleted: true, ...updatedProfile };
      setUser(updatedUser);
      localStorage.setItem('becs_user', JSON.stringify(updatedUser));
      
      // Redirect to enrollment if not enrolled, or dashboard
      if (updatedUser.enrollmentStatus === 'NOT_ENROLLED' || !updatedUser.enrollmentStatus) {
        navigate('/enrollment');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      alert(err.message || 'Failed to complete profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: '#f8fafc' }}>
      <div style={{ width: '100%', maxWidth: '600px', background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}>
        <h2 style={{ fontSize: '2rem', fontFamily: 'Outfit', color: '#1e293b', marginBottom: '8px', textAlign: 'center' }}>Complete Your Profile</h2>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '32px' }}>Please provide these details to continue to enrollment.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Highest Education</label>
            <input type="text" required value={formData.highestEducation} onChange={e => setFormData({...formData, highestEducation: e.target.value})} placeholder="e.g. B.Tech, B.Sc, 12th Pass" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1.5px solid #e2e8f0' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Preparing For</label>
            <select required value={formData.preparingFor} onChange={e => setFormData({...formData, preparingFor: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: 'white' }}>
              <option value="" disabled>Select your goal</option>
              <option value="Government Exam Preparation">Government Exam Preparation</option>
              <option value="Joint Entrance Preparation">Joint Entrance Preparation</option>
              <option value="Board Exam — Class 10">Board Exam — Class 10</option>
              <option value="Board Exam — Class 11–12">Board Exam — Class 11–12</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>Address</label>
            <input type="text" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Street address" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1.5px solid #e2e8f0' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>City</label>
              <input type="text" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1.5px solid #e2e8f0' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>PIN Code</label>
              <input type="text" required value={formData.pinCode} onChange={e => setFormData({...formData, pinCode: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1.5px solid #e2e8f0' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>State</label>
            <input type="text" required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1.5px solid #e2e8f0' }} />
          </div>

          <button type="submit" disabled={isLoading} className="btn-solid-lg" style={{ marginTop: '12px', padding: '14px', fontSize: '1.05rem', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }}>
            {isLoading ? 'Saving...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
