import React, { useState, useEffect } from 'react';
import api from '../api';

const ModerationDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch from /api/discussions/reports
    setTimeout(() => {
      setReports([
        { _id: 'r1', type: 'spam', target: 'discussion', content: 'Buy cheap crypto here!', reportedBy: 'John D.', date: new Date().toISOString(), status: 'pending', targetId: 'd1', author: 'Spammer99' },
        { _id: 'r2', type: 'harassment', target: 'reply', content: 'You are so stupid for asking this.', reportedBy: 'Sarah J.', date: new Date(Date.now() - 86400000).toISOString(), status: 'pending', targetId: 'reply4', author: 'ToxicUser' }
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const handleAction = (reportId, action) => {
    // API Call to execute moderation
    // if action === 'delete_post', api.delete(`/discussions/${targetId}`)
    // if action === 'mute_user', api.put(`/users/${author}/mute`)
    
    setReports(reports.filter(r => r._id !== reportId));
    alert(`Action executed: ${action.replace('_', ' ').toUpperCase()}`);
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Moderation Queue...</div>;

  return (
    <div style={{ padding: '32px', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: '#1e293b' }}>Moderation & Trust Center</h1>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Review community reports, mute abusive users, and maintain a safe learning environment.</p>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ background: '#f8fafc', padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#0f172a' }}>Active Reports ({reports.length})</h3>
        </div>

        {reports.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✨</div>
            No pending reports! The community is safe.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.9rem' }}>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>Violation Type</th>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>Content Preview</th>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>Reported Author</th>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>Date</th>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      background: report.type === 'harassment' ? '#fee2e2' : '#fef3c7', 
                      color: report.type === 'harassment' ? '#b91c1c' : '#b45309',
                      padding: '4px 12px', 
                      borderRadius: '16px', 
                      fontSize: '0.8rem', 
                      fontWeight: 600,
                      textTransform: 'uppercase'
                    }}>
                      {report.type}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', maxWidth: '300px' }}>
                    <div style={{ color: '#1e293b', fontWeight: 500, fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      "{report.content}"
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', color: '#475569', fontWeight: 600 }}>{report.author}</td>
                  <td style={{ padding: '16px 24px', color: '#94a3b8', fontSize: '0.9rem' }}>
                    {new Date(report.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => handleAction(report._id, 'ignore')}
                        style={{ background: 'white', border: '1px solid #cbd5e1', color: '#64748b', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                      >
                        Ignore
                      </button>
                      <button 
                        onClick={() => handleAction(report._id, 'delete_post')}
                        style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                      >
                        Delete Post
                      </button>
                      <button 
                        onClick={() => handleAction(report._id, 'mute_user')}
                        style={{ background: '#ef4444', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                      >
                        Mute User (7d)
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ModerationDashboard;
