import React, { useState, useEffect } from 'react';
import api from '../../api';

const AdminLearningAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ progressCount: 0, testCount: 0 });

  useEffect(() => {
    // Simulate loading for the demo
    
    const fetchLearning = async () => {
      try {
        const res = await api.get('/admin-v2/learning-analytics');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching learning analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLearning();
  }, []);


  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#0f172a', margin: '0 0 8px 0', fontWeight: 800 }}>Learning Analytics</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Aggregate student performance and engagement metrics.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>Loading learning analytics...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#0f172a' }}>Platform Average Score</h3>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: '#3b82f6' }}>76.4%</div>
            <p style={{ margin: '8px 0 0 0', color: '#64748b' }}>Across all mock tests this month.</p>
          </div>

          <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#0f172a' }}>Video Watch Time</h3>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: '#f59e0b' }}>12,450 <span style={{ fontSize: '1.2rem' }}>hrs</span></div>
            <p style={{ margin: '8px 0 0 0', color: '#64748b' }}>Total content consumed.</p>
          </div>

          <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', gridColumn: '1 / -1' }}>
            <h3 style={{ margin: '0 0 24px 0', color: '#0f172a' }}>Engagement Heatmap</h3>
            <div style={{ height: '200px', display: 'flex', flexWrap: 'wrap', gap: '4px', background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
              {/* Mock Heatmap */}
              {Array.from({ length: 150 }).map((_, i) => (
                <div key={i} style={{ width: '16px', height: '16px', borderRadius: '4px', background: `rgba(59, 130, 246, ${Math.random() * 0.8 + 0.1})` }} />
              ))}
            </div>
            <p style={{ marginTop: '16px', color: '#64748b', fontSize: '0.9rem', textAlign: 'center' }}>Daily active users (DAU) distribution over the last quarter.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLearningAnalytics;
