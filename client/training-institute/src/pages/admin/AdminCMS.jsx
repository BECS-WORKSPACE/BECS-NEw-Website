import React, { useState } from 'react';

const AdminCMS = () => {
  const [activeTab, setActiveTab] = useState('banners');

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#0f172a', margin: '0 0 8px 0', fontWeight: 800 }}>Website CMS</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Manage homepage content, banners, FAQ, and Testimonials.</p>
        </div>
        <button style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
          Publish Changes
        </button>
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Sidebar Tabs */}
        <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['banners', 'testimonials', 'faq', 'footer'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 16px',
                textAlign: 'left',
                border: 'none',
                background: activeTab === tab ? '#e0f2fe' : 'transparent',
                color: activeTab === tab ? '#0369a1' : '#475569',
                fontWeight: activeTab === tab ? 700 : 600,
                borderRadius: '8px',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px' }}>
          <h2 style={{ margin: '0 0 24px 0', color: '#0f172a', textTransform: 'capitalize' }}>Manage {activeTab}</h2>
          
          <div style={{ border: '2px dashed #cbd5e1', padding: '40px', borderRadius: '12px', textAlign: 'center', color: '#94a3b8' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '12px' }}>🏗️</span>
            CMS editor for {activeTab} will render here.
            <br />
            (Drag & drop support, WYSIWYG editor)
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCMS;
