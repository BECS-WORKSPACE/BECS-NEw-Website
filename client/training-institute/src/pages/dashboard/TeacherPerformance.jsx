import React, { useState, useEffect } from 'react';
import api from '../../api';

const TeacherPerformance = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/teacher/performance');
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{ padding: '40px' }}>Loading Performance Data...</div>;
  if (!stats) return <div style={{ padding: '40px' }}>No Data Available.</div>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <h1 style={{ fontSize: '2rem', color: '#1e293b', margin: '0 0 8px 0', fontWeight: 800 }}>Performance Analytics</h1>
      <p style={{ color: '#64748b', margin: '0 0 32px 0' }}>Track class trends and identify top performers.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <span style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '8px' }}>Average Attendance</span>
          <span style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>{stats.averageAttendance}%</span>
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <span style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '8px' }}>Average Test Score</span>
          <span style={{ fontSize: '2rem', fontWeight: 800, color: '#3b82f6' }}>{stats.averageTestScore}%</span>
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <span style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '8px' }}>Assignments Submitted</span>
          <span style={{ fontSize: '2rem', fontWeight: 800, color: '#8b5cf6' }}>{stats.totalAssignmentsSubmitted}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 16px 0' }}>Class Trend (Last 6 Tests)</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '200px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
            {stats.classTrend.map((val, i) => (
              <div key={i} style={{ flex: 1, background: '#3b82f6', height: `${val}%`, borderRadius: '4px 4px 0 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', color: 'white', fontSize: '0.8rem', paddingTop: '4px' }}>
                {val}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 16px 0' }}>Top Performers</h3>
          {stats.topPerformers.map((p, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontWeight: 600 }}>{i + 1}. {p.name}</span>
              <span style={{ color: '#10b981', fontWeight: 700 }}>{p.score}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherPerformance;
