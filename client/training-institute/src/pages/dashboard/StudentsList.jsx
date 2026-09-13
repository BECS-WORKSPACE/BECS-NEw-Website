import React, { useState } from 'react';

const StudentsList = () => {
  const [search, setSearch] = useState('');

  const dummyStudents = [
    { id: 1, name: 'Sujay Barman', email: 'sujay@example.com', course: 'Physics Mechanics', progress: 85, score: 92, lastActive: '2 hours ago' },
    { id: 2, name: 'Rahul Kumar', email: 'rahul@example.com', course: 'Thermodynamics', progress: 45, score: 76, lastActive: '1 day ago' },
    { id: 3, name: 'Priya Sharma', email: 'priya@example.com', course: 'Physics Mechanics', progress: 100, score: 88, lastActive: '5 mins ago' },
    { id: 4, name: 'Amit Singh', email: 'amit@example.com', course: 'Calculus Basics', progress: 12, score: 65, lastActive: '3 days ago' },
  ];

  const filtered = dummyStudents.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#1e293b', margin: '0 0 8px 0', fontWeight: 800 }}>Student Management</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Monitor student progress, grades, and activity across your courses.</p>
        </div>
        <button style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>
          Export Report (CSV)
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
        
        <div style={{ marginBottom: '24px', maxWidth: '400px' }}>
          <input 
            type="text" 
            placeholder="Search students by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '16px 8px', fontWeight: 700 }}>Student</th>
                <th style={{ padding: '16px 8px', fontWeight: 700 }}>Course</th>
                <th style={{ padding: '16px 8px', fontWeight: 700 }}>Progress</th>
                <th style={{ padding: '16px 8px', fontWeight: 700 }}>Avg. Score</th>
                <th style={{ padding: '16px 8px', fontWeight: 700 }}>Last Active</th>
                <th style={{ padding: '16px 8px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '16px 8px' }}>
                    <div style={{ fontWeight: 700, color: '#1e293b' }}>{s.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{s.email}</div>
                  </td>
                  <td style={{ padding: '16px 8px', color: '#475569', fontWeight: 600 }}>{s.course}</td>
                  <td style={{ padding: '16px 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '100px', height: '6px', background: '#cbd5e1', borderRadius: '3px' }}>
                        <div style={{ width: `${s.progress}%`, height: '100%', background: s.progress === 100 ? '#10b981' : '#3b82f6', borderRadius: '3px' }}></div>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{s.progress}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 8px', fontWeight: 700, color: s.score >= 80 ? '#10b981' : s.score >= 60 ? '#f59e0b' : '#ef4444' }}>{s.score}%</td>
                  <td style={{ padding: '16px 8px', color: '#64748b', fontSize: '0.9rem' }}>{s.lastActive}</td>
                  <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                    <button style={{ background: '#f1f5f9', color: '#3b82f6', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>View Profile</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>No students found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentsList;
