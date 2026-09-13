import React from 'react';

const AdminHome = () => {
  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', color: '#1e293b', margin: '0 0 8px 0', fontWeight: 800 }}>Admin Dashboard</h1>
        <p style={{ color: '#64748b', margin: 0 }}>Enterprise overview of revenue, users, and content moderation.</p>
      </div>

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {[
          { label: 'Total Revenue', value: '₹14,25,000', change: '+12%', color: '#10b981' },
          { label: 'Active Subscriptions', value: '3,245', change: '+5%', color: '#3b82f6' },
          { label: 'Total Students', value: '12,500', change: '+8%', color: '#8b5cf6' },
          { label: 'Total Faculty', value: '142', change: '0%', color: '#f59e0b' }
        ].map(stat => (
          <div key={stat.label} style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>{stat.label}</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
              <h4 style={{ margin: 0, fontSize: '1.8rem', color: '#1e293b', fontWeight: 800 }}>{stat.value}</h4>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: stat.change.startsWith('+') ? '#10b981' : '#64748b', marginBottom: '4px' }}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', '@media (max-width: 900px)': { gridTemplateColumns: '1fr' } }}>
        
        {/* Recent Transactions */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b', fontWeight: 700 }}>Recent Transactions</h3>
            <button style={{ background: 'none', border: 'none', color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}>View All</button>
          </div>
          <div style={{ padding: '0' }}>
            {[
              { student: 'Amit Singh', plan: 'Premium Access', amount: '₹4,999', status: 'Success', date: '2 mins ago' },
              { student: 'Priya Sharma', plan: 'Foundation Batch', amount: '₹999', status: 'Success', date: '15 mins ago' },
              { student: 'Rahul Kumar', plan: 'Premium Access', amount: '₹4,999', status: 'Failed', date: '1 hour ago' }
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', color: '#1e293b', fontWeight: 600 }}>{t.student}</h4>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{t.plan} • {t.date}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1rem', color: '#1e293b', fontWeight: 700 }}>{t.amount}</div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: t.status === 'Success' ? '#10b981' : '#ef4444' }}>{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Moderation / CMS */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', color: '#1e293b', fontWeight: 700 }}>Content Management (CMS)</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', background: '#e0f2fe', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📰</div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#1e293b' }}>Manage Blogs & News</h4>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>12 Drafts waiting for approval</span>
                </div>
              </div>
              <button style={{ background: 'white', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Review</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', background: '#fffbeb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>⚠️</div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#1e293b' }}>Doubt Forum Moderation</h4>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>5 reported posts</span>
                </div>
              </div>
              <button style={{ background: 'white', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Moderate</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', background: '#f3e8ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>⚙️</div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#1e293b' }}>Site Configuration</h4>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Update banners and pricing</span>
                </div>
              </div>
              <button style={{ background: 'white', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Edit</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminHome;
