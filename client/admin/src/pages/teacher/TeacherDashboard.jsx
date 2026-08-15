import React, { useState, useEffect } from 'react';
import api from '../../api'; // Assuming you have api configured in admin

const TeacherDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/teacher/dashboard');
        setStats(res.data);
      } catch (error) {
        console.error('Failed to load dashboard', error);
        // Fallback for UI visualization
        setStats({
          overview: { activeCourses: 4, totalStudents: 1250, pendingSubmissions: 24, upcomingClassesCount: 2 },
          upcomingClasses: [
            { _id: '1', title: 'React Hooks Deep Dive', scheduledAt: new Date(Date.now() + 3600000).toISOString() },
            { _id: '2', title: 'Node.js Event Loop', scheduledAt: new Date(Date.now() + 86400000).toISOString() }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading your dashboard...</div>;

  return (
    <div style={{ padding: '32px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', margin: '0 0 8px 0', color: '#1e293b' }}>Welcome back, Professor! 👋</h1>
        <p style={{ color: '#64748b', margin: 0 }}>Here is what's happening across your courses today.</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', borderLeft: '4px solid #4f46e5' }}>
          <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Assigned Courses</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a' }}>{stats.overview.activeCourses}</div>
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', borderLeft: '4px solid #10b981' }}>
          <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Total Students Enrolled</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a' }}>{stats.overview.totalStudents}</div>
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Pending Submissions</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a' }}>{stats.overview.pendingSubmissions}</div>
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', borderLeft: '4px solid #ef4444' }}>
          <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Upcoming Classes</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a' }}>{stats.overview.upcomingClassesCount}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        
        {/* Schedule */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ background: '#f8fafc', padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, color: '#0f172a' }}>Your Schedule</h3>
          </div>
          <div style={{ padding: '24px' }}>
            {stats.upcomingClasses.length === 0 ? (
              <p style={{ color: '#64748b' }}>No live classes scheduled for today.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {stats.upcomingClasses.map((cls, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', color: '#1e293b' }}>{cls.title}</h4>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{new Date(cls.scheduledAt).toLocaleString()}</div>
                    </div>
                    <button style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                      Start Class
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <h3 style={{ margin: '0 0 24px 0', color: '#0f172a' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button style={{ width: '100%', padding: '12px', textAlign: 'left', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#334155' }}>
              📝 Grade Assignments
            </button>
            <button style={{ width: '100%', padding: '12px', textAlign: 'left', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#334155' }}>
              📅 Schedule Live Class
            </button>
            <button style={{ width: '100%', padding: '12px', textAlign: 'left', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#334155' }}>
              ❓ Answer Student Doubts
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TeacherDashboard;
