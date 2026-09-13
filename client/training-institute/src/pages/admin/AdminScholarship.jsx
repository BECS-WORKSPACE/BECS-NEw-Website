import React, { useState, useEffect } from 'react';
import api from '../../api';

const AdminScholarship = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demo purposes
    const fetchScholarships = async () => {
      try {
        const res = await api.get('/admin-v2/scholarships');
        if (res.data.success) { setScholarships(res.data.data); }
      } catch (err) {
        console.error('Error fetching scholarships:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchScholarships();
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#0f172a', margin: '0 0 8px 0', fontWeight: 800 }}>Scholarships</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Manage scholarship tests, tiers, and applicants.</p>
        </div>
        <button style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
          + New Scholarship Test
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Loading scholarships...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Test Name</th>
   <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Created At</th>
   <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Questions Count</th>
   <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {scholarships.length > 0 ? (
                scholarships.map(s => (
                  <tr key={s._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '16px 24px', fontWeight: 600, color: '#1e293b' }}>{s.title}</td>
   <td style={{ padding: '16px 24px', color: '#64748b' }}>{s.createdAt}</td>
   <td style={{ padding: '16px 24px', color: '#64748b' }}>{s.questionsCount}</td>
   <td style={{ padding: '16px 24px' }}>
     <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, background: '#dcfce3', color: '#166534' }}>
       Active
     </span>
   </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No scholarships found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminScholarship;
