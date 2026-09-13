import React, { useState, useEffect } from 'react';
import api from '../../api';

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin-v2/overview');
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{ padding: '40px' }}>Loading Admin Dashboard...</div>;
  if (!stats) return <div style={{ padding: '40px' }}>Failed to load dashboard data.</div>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#0f172a', margin: '0 0 8px 0', fontWeight: 800 }}>Platform Overview</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Real-time metrics for EduVerse platform.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* Primary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Total Revenue</span>
            <span style={{ padding: '4px 8px', background: '#dcfce3', color: '#166534', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>+12.5%</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a' }}>₹{stats.totalRevenue.toLocaleString()}</div>
          <div style={{ marginTop: '12px', fontSize: '0.85rem', color: '#64748b' }}>
            <span style={{ color: '#3b82f6', fontWeight: 600 }}>MRR: ₹{stats.mrr.toLocaleString()}</span> • One-time: ₹{stats.enrollmentRevenue.toLocaleString()}
          </div>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Active Students</span>
            <span style={{ padding: '4px 8px', background: '#eff6ff', color: '#1d4ed8', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>Users</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a' }}>{stats.totalStudents.toLocaleString()}</div>
          <div style={{ marginTop: '12px', fontSize: '0.85rem', color: '#64748b' }}>
            <span style={{ color: '#10b981', fontWeight: 600 }}>{stats.enrolledStudents} Enrolled</span> • {stats.activeSubscriptions} Subscriptions
          </div>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Active Courses</span>
            <span style={{ padding: '4px 8px', background: '#fef3c7', color: '#b45309', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>Content</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a' }}>{stats.activeCourses}</div>
          <div style={{ marginTop: '12px', fontSize: '0.85rem', color: '#64748b' }}>
            Managed by <span style={{ fontWeight: 600, color: '#f59e0b' }}>{stats.totalTeachers} Teachers</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Charts Section */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 24px 0', color: '#0f172a' }}>Revenue Trend</h3>
          <div style={{ height: '280px', display: 'flex', alignItems: 'flex-end', gap: '16px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
            {/* Mock Chart Bars */}
            {[40, 60, 45, 80, 65, 90, 85].map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '100%', background: '#3b82f6', height: `${h}%`, borderRadius: '4px 4px 0 0', opacity: h > 80 ? 1 : 0.7 }} />
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>D{i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Center / Recent Activity */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 24px 0', color: '#0f172a' }}>Alert Center</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {stats.recentActivity.map((act, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: act.message.includes('failed') ? '#ef4444' : '#10b981', marginTop: '6px' }} />
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '0.95rem', color: '#1e293b' }}>{act.message}</p>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{act.time}</span>
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ margin: '32px 0 16px 0', color: '#0f172a' }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button style={{ padding: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#475569', fontSize: '0.85rem' }}>+ Add Student</button>
            <button style={{ padding: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#475569', fontSize: '0.85rem' }}>+ Add Course</button>
            <button style={{ padding: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#475569', fontSize: '0.85rem' }}>+ Create Test</button>
            <button style={{ padding: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#475569', fontSize: '0.85rem' }}>+ Add Teacher</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminOverview;
