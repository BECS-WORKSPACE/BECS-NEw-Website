import React, { useState, useEffect } from 'react';
import api from '../../api';

const AdminCourseContent = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demo purposes, we fetch everything from curriculum and filter draft ones
    const fetchContent = async () => {
      try {
        // Ideally this would be an admin endpoint like /admin-v2/content-approvals
        // Simulating data
        const res = await api.get('/admin-v2/content-approvals');
        if(res.data.success) setContent(res.data.data);
      } catch (err) {
        console.error('Error fetching content:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#0f172a', margin: '0 0 8px 0', fontWeight: 800 }}>Content Approval</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Review and approve content submitted by teachers.</p>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Loading content...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Content Title</th>
                <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Type</th>
                <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Course</th>
                <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Teacher</th>
                <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Submitted At</th>
                <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {content.length > 0 ? (
                content.map(item => (
                  <tr key={item._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '16px 24px', fontWeight: 600, color: '#1e293b' }}>{item.title}</td>
                    <td style={{ padding: '16px 24px', color: '#64748b' }}>
                      <span style={{ padding: '4px 8px', borderRadius: '4px', background: '#f1f5f9', fontSize: '0.75rem', fontWeight: 600 }}>{item.type}</span>
                    </td>
                    <td style={{ padding: '16px 24px', color: '#64748b' }}>{item.course}</td>
                    <td style={{ padding: '16px 24px', color: '#64748b' }}>{item.teacher}</td>
                    <td style={{ padding: '16px 24px', color: '#64748b' }}>{new Date(item.submittedAt).toLocaleDateString()}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <button style={{ background: '#10b981', border: 'none', color: 'white', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight: 600, marginRight: '8px' }}>Approve</button>
                      <button style={{ background: '#ef4444', border: 'none', color: 'white', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', fontWeight: 600 }}>Reject</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No pending content approvals.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminCourseContent;
