import React, { useState, useEffect } from 'react';
import api from '../../api';

const AdminVideoAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/admin-analytics/overview');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div style={{ padding: '40px' }}>Loading Enterprise Analytics...</div>;
  if (!data) return <div style={{ padding: '40px' }}>Failed to load data.</div>;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: 'var(--navy)', fontFamily: 'Outfit', fontSize: '2rem', marginBottom: '8px' }}>
        Video Streaming Analytics
      </h1>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Enterprise metrics for student engagement and completion rates.</p>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        
        <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <p style={{ margin: '0 0 8px 0', color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>Total Watch Time</p>
          <h2 style={{ margin: 0, color: 'var(--navy)', fontSize: '2.5rem' }}>{data.kpis.totalWatchTimeHours} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>hrs</span></h2>
        </div>

        <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <p style={{ margin: '0 0 8px 0', color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>Total Video Views</p>
          <h2 style={{ margin: 0, color: '#3b82f6', fontSize: '2.5rem' }}>{data.kpis.totalViews}</h2>
        </div>

        <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <p style={{ margin: '0 0 8px 0', color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>Avg. Completion Rate</p>
          <h2 style={{ margin: 0, color: '#10b981', fontSize: '2.5rem' }}>{data.kpis.averageCompletionRate}%</h2>
        </div>

        <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <p style={{ margin: '0 0 8px 0', color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>Completed Lessons</p>
          <h2 style={{ margin: 0, color: '#f59e0b', fontSize: '2.5rem' }}>{data.kpis.completedLessons}</h2>
        </div>
      </div>

      {/* Top Performing Lessons Table */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <h3 style={{ margin: 0, color: 'var(--navy)', fontSize: '1.2rem', fontWeight: 700 }}>Top Performing Lessons</h3>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>LESSON NAME</th>
                <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>VIEWS</th>
                <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>AVG. COMPLETION</th>
              </tr>
            </thead>
            <tbody>
              {data.topLessons.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>No video analytics data available yet.</td>
                </tr>
              ) : (
                data.topLessons.map((lesson, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 24px', color: 'var(--navy)', fontWeight: 500 }}>{lesson.title || 'Untitled Lesson'}</td>
                    <td style={{ padding: '16px 24px', color: '#3b82f6', fontWeight: 600 }}>{lesson.views}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ flex: 1, background: '#e2e8f0', height: '8px', borderRadius: '4px' }}>
                          <div style={{ width: `${lesson.avgCompletion}%`, background: '#10b981', height: '100%', borderRadius: '4px' }}></div>
                        </div>
                        <span style={{ color: '#475569', fontSize: '0.9rem', fontWeight: 600, minWidth: '40px' }}>{lesson.avgCompletion}%</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
};

export default AdminVideoAnalytics;
