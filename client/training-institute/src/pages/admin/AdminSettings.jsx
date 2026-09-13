import React from 'react';

const AdminSettings = () => {
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#0f172a', margin: '0 0 8px 0', fontWeight: 800 }}>Settings & Audit Logs</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Configure system properties and view security audit trails.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* System Config */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px' }}>
          <h3 style={{ margin: '0 0 24px 0', color: '#0f172a' }}>Global Settings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Platform Name</label>
              <input type="text" defaultValue="EduVerse" style={{ width: '100%', padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Support Email</label>
              <input type="email" defaultValue="support@eduverse.com" style={{ width: '100%', padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Razorpay Key ID</label>
              <input type="password" defaultValue="rzp_test_123456789" style={{ width: '100%', padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
            </div>
            <button style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-start', marginTop: '8px' }}>
              Save Settings
            </button>
          </div>
        </div>

        {/* Audit Logs */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px' }}>
          <h3 style={{ margin: '0 0 24px 0', color: '#0f172a' }}>Recent Audit Logs</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: '#ef4444', fontWeight: 700 }}>[DELETE]</span> Course 'Physics 101' deleted by Super Admin - <span style={{ color: '#94a3b8' }}>2 mins ago</span>
            </div>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: '#3b82f6', fontWeight: 700 }}>[UPDATE]</span> Razorpay key modified by Super Admin - <span style={{ color: '#94a3b8' }}>15 mins ago</span>
            </div>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: '#10b981', fontWeight: 700 }}>[CREATE]</span> Scholarship Test published by Super Admin - <span style={{ color: '#94a3b8' }}>1 hour ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
