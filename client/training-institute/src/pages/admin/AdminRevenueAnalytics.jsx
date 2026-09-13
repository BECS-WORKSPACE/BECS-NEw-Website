import React, { useState, useEffect } from 'react';
import api from '../../api';

const AdminRevenueAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demo purposes we map to overview or mock the data
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/admin-v2/overview');
        setData(res.data.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#0f172a', margin: '0 0 8px 0', fontWeight: 800 }}>Revenue Analytics</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Detailed financial reports and MRR tracking.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>Loading analytics...</div>
      ) : data ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#0f172a' }}>Monthly Recurring Revenue (MRR)</h3>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: '#10b981' }}>₹{data.mrr.toLocaleString()}</div>
            <p style={{ margin: '8px 0 0 0', color: '#64748b' }}>Generated from {data.activeSubscriptions} active subscriptions.</p>
          </div>

          <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#0f172a' }}>One-time Enrollments</h3>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: '#3b82f6' }}>₹{data.enrollmentRevenue.toLocaleString()}</div>
            <p style={{ margin: '8px 0 0 0', color: '#64748b' }}>Generated from {data.enrolledStudents} course purchases.</p>
          </div>

          <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', gridColumn: '1 / -1' }}>
            <h3 style={{ margin: '0 0 24px 0', color: '#0f172a' }}>Revenue Growth (YTD)</h3>
            <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '24px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
              {/* Mock Chart Bars */}
              {[30, 45, 40, 60, 55, 80, 75, 90, 85, 100].map((h, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '100%', background: 'linear-gradient(to top, #10b981, #34d399)', height: `${h}%`, borderRadius: '6px 6px 0 0' }} />
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>M{i+1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ padding: '40px', textAlign: 'center' }}>Failed to load data.</div>
      )}
    </div>
  );
};

export default AdminRevenueAnalytics;
