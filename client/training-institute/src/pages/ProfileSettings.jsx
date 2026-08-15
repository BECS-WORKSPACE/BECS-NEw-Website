import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const ProfileSettings = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    name: '', phone: '', gender: '', dob: '', address: '', state: '', district: '', country: 'India',
    education: '', institute: '', course: '', bio: '',
    socialLinks: { linkedin: '', github: '', twitter: '', portfolio: '' },
    preferences: { theme: 'system', language: 'en', notifications: { email: true, push: true } },
    skills: '', goals: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        const data = res.data;
        // Format arrays to strings for simple inputs
        const skillsStr = Array.isArray(data.skills) ? data.skills.join(', ') : data.skills || '';
        const goalsStr = Array.isArray(data.goals) ? data.goals.join(', ') : data.goals || '';
        
        setFormData({ 
          ...formData, 
          ...data, 
          socialLinks: { ...formData.socialLinks, ...data.socialLinks },
          preferences: { ...formData.preferences, ...data.preferences },
          skills: skillsStr,
          goals: goalsStr
        });
      } catch (err) { console.error('Failed to load profile'); }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const parts = name.split('.');
      if (parts.length === 2) {
        setFormData({ ...formData, [parts[0]]: { ...formData[parts[0]], [parts[1]]: type === 'checkbox' ? checked : value } });
      } else if (parts.length === 3) {
        setFormData({
          ...formData,
          [parts[0]]: {
            ...formData[parts[0]],
            [parts[1]]: {
              ...formData[parts[0]][parts[1]],
              [parts[2]]: type === 'checkbox' ? checked : value
            }
          }
        });
      }
    } else {
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Convert strings back to arrays
    const payload = {
      ...formData,
      skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
      goals: formData.goals ? formData.goals.split(',').map(s => s.trim()) : []
    };

    try {
      const res = await api.put('/users/profile', payload);
      setUser(res.data);
      localStorage.setItem('becs_user', JSON.stringify({ ...user, ...res.data }));
      alert('Profile updated successfully');
    } catch (err) {
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'education', label: 'Education & Bio', icon: '🎓' },
    { id: 'goals', label: 'Goals & Preferences', icon: '🎯' },
    { id: 'security', label: 'Security', icon: '🔒' }
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <h2 style={{ fontSize: '2rem', fontFamily: 'Outfit', color: 'var(--navy)', marginBottom: '8px', fontWeight: 700 }}>Profile & Settings</h2>
      <p style={{ color: '#64748b', fontSize: '1.05rem', margin: '0 0 32px 0' }}>Manage your personal information, learning goals, and security preferences.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '32px', '@media (max-width: 768px)': { gridTemplateColumns: '1fr' } }}>
        
        {/* Sidebar Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 600, transition: 'all 0.2s',
                background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#475569',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(37,99,235,0.2)' : 'none'
              }}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ background: '#ffffff', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {activeTab === 'personal' && (
              <div className="animate-fade-in">
                <h3 style={{ fontSize: '1.3rem', color: 'var(--navy)', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '24px' }}>Personal Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Email</label>
                    <input type="email" value={user?.email || ''} disabled style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#e2e8f0', color: '#64748b' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Phone</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none' }}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="animate-fade-in">
                <h3 style={{ fontSize: '1.3rem', color: 'var(--navy)', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '24px' }}>Education & Bio</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Highest Education</label>
                    <input type="text" name="education" value={formData.education} onChange={handleChange} placeholder="e.g. B.Tech Computer Science" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Institute</label>
                    <input type="text" name="institute" value={formData.institute} onChange={handleChange} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none' }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Short Bio</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" placeholder="Tell us about yourself..." style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none', resize: 'vertical' }}></textarea>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'goals' && (
              <div className="animate-fade-in">
                <h3 style={{ fontSize: '1.3rem', color: 'var(--navy)', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '24px' }}>Goals & Preferences</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Learning Goals (Comma separated)</label>
                    <input type="text" name="goals" value={formData.goals} onChange={handleChange} placeholder="e.g. Crack FAANG, Learn React, Master DSA" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Current Skills (Comma separated)</label>
                    <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. JavaScript, Python, C++" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none' }} />
                  </div>
                  
                  <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 16px 0', color: 'var(--navy)' }}>Notification Preferences</h4>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', cursor: 'pointer' }}>
                      <input type="checkbox" name="preferences.notifications.email" checked={formData.preferences.notifications.email} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                      <span>Email Notifications (Course updates, announcements)</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <input type="checkbox" name="preferences.notifications.push" checked={formData.preferences.notifications.push} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                      <span>Push Notifications (Live class reminders, deadlines)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="animate-fade-in">
                <h3 style={{ fontSize: '1.3rem', color: 'var(--navy)', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '24px' }}>Security Settings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <p style={{ color: '#64748b' }}>To change your password, click the button below. An email will be sent to your registered email address with instructions.</p>
                  <button type="button" style={{ alignSelf: 'flex-start', padding: '12px 24px', background: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>
                    Request Password Reset
                  </button>
                </div>
              </div>
            )}

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={loading} style={{ background: 'var(--primary)', color: 'white', padding: '14px 40px', borderRadius: '12px', border: 'none', fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)', transition: 'transform 0.2s' }}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
