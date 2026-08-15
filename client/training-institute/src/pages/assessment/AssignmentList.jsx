import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseAssignments } from '../../api';

const AssignmentList = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await getCourseAssignments(courseId);
        setAssignments(data);
      } catch (err) {
        console.error('Error fetching assignments:', err);
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchAssignments();
  }, [courseId]);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading assignments...</div>;
  }

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Course Assignments</h1>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Complete your assignments to unlock certificates and improve your grade.</p>

      {assignments.length === 0 ? (
        <div style={{ background: '#f8fafc', padding: '40px', borderRadius: '16px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>📚</div>
          <h3 style={{ margin: '0 0 8px 0', color: '#334155' }}>No assignments yet</h3>
          <p style={{ color: '#64748b', margin: 0 }}>There are no active assignments for this course.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {assignments.map(assignment => (
            <div 
              key={assignment._id}
              onClick={() => navigate(`/dashboard/assignments/${assignment._id}/submit`)}
              style={{ 
                background: 'white', 
                border: '1px solid #e2e8f0', 
                borderRadius: '16px', 
                padding: '24px', 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0,0,0,0.05)'; }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
                    {assignment.type.replace('_', ' ')}
                  </span>
                  {assignment.isPremium && (
                    <span style={{ background: '#fef3c7', color: '#d97706', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                      👑 PREMIUM
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>{assignment.title}</h3>
                <div style={{ display: 'flex', gap: '24px', color: '#64748b', fontSize: '0.9rem' }}>
                  <div>🎯 Max Marks: <span style={{ fontWeight: 600, color: '#334155' }}>{assignment.maxMarks}</span></div>
                  <div>📅 Due: <span style={{ fontWeight: 600, color: '#334155' }}>{new Date(assignment.dueDate).toLocaleDateString()}</span></div>
                </div>
              </div>
              
              <div>
                <button style={{ background: 'var(--navy)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentList;
