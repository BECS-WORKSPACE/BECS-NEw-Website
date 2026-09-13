import React from 'react';

const TeacherHome = () => {
  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', color: '#1e293b', margin: '0 0 8px 0', fontWeight: 800 }}>Faculty Dashboard</h1>
        <p style={{ color: '#64748b', margin: 0 }}>Manage your courses, live classes, and evaluate student performance.</p>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', padding: '24px', borderRadius: '16px', color: 'white', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🔴</div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 700 }}>Go Live</h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', opacity: 0.9 }}>Start a scheduled or instant live class.</p>
          <button style={{ background: 'white', color: '#2563eb', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Start Class</button>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>💬</div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#1e293b', fontWeight: 700 }}>Resolve Doubts</h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#64748b' }}>12 pending student questions require your attention.</p>
          <button style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>View Doubts</button>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>📝</div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#1e293b', fontWeight: 700 }}>Evaluate Assignments</h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#64748b' }}>45 student submissions waiting for grading.</p>
          <button style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Evaluate</button>
        </div>
      </div>

      {/* Course Stats */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
        <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '24px', fontWeight: 700 }}>Active Courses Performance</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { name: 'Physics Mechanics (Batch A)', students: 120, avgScore: 78, completion: 45 },
            { name: 'Thermodynamics Crash Course', students: 85, avgScore: 82, completion: 80 }
          ].map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div>
                <h4 style={{ margin: '0 0 4px 0', color: '#1e293b', fontSize: '1.05rem', fontWeight: 700 }}>{c.name}</h4>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{c.students} Students Enrolled</span>
              </div>
              <div style={{ display: 'flex', gap: '32px' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Avg. Score</p>
                  <span style={{ fontSize: '1.1rem', color: '#10b981', fontWeight: 800 }}>{c.avgScore}%</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Completion</p>
                  <span style={{ fontSize: '1.1rem', color: '#3b82f6', fontWeight: 800 }}>{c.completion}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherHome;
