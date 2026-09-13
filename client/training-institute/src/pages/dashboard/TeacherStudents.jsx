import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api';

const TeacherStudents = () => {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('course');
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, [courseId]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const endpoint = courseId ? `/teacher/students?courseId=${courseId}` : '/teacher/students';
      const res = await api.get(endpoint);
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch students.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading Students...</div>;
  if (error) return <div style={{ padding: '40px', color: 'red' }}>{error}</div>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#1e293b', margin: '0 0 8px 0', fontWeight: 800 }}>Student Management</h1>
          <p style={{ color: '#64748b', margin: 0 }}>View and manage students enrolled in your assigned courses.</p>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>Student Name</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>Email</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>Course</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>Progress</th>
              <th style={{ padding: '16px 24px', textAlign: 'center', color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>No students found in your assigned courses.</td>
              </tr>
            ) : (
              students.map((student, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '16px 24px', color: '#1e293b', fontWeight: 600 }}>{student.user?.name || 'Unknown'}</td>
                  <td style={{ padding: '16px 24px', color: '#64748b' }}>{student.user?.email || 'N/A'}</td>
                  <td style={{ padding: '16px 24px', color: '#64748b' }}>{student.course?.title || 'Unknown Course'}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ flex: 1, background: '#e2e8f0', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                        <div style={{ width: `${student.progressPercentage || 0}%`, background: '#10b981', height: '100%' }}></div>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{student.progressPercentage || 0}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                    <button style={{ background: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe', padding: '6px 12px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
                      Message
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherStudents;
