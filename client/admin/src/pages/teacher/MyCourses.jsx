import React, { useState, useEffect } from 'react';
import api from '../../api';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/teacher/courses');
        setCourses(res.data);
      } catch (error) {
        console.error('Failed to load assigned courses', error);
        // Fallback for UI visualization
        setCourses([
          { _id: '1', title: 'Full Stack MERN Architecture', studentCount: 840, status: 'published', rating: 4.8 },
          { _id: '2', title: 'Advanced React Patterns', studentCount: 0, status: 'draft', rating: 0 }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleEditClick = (courseId) => {
    alert(`Opening curriculum builder for course: ${courseId}. (This restricts access to only this course ID)`);
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading your curriculum...</div>;

  return (
    <div style={{ padding: '32px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', margin: '0 0 8px 0', color: '#1e293b' }}>My Courses</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Manage the curriculum for the courses you are assigned to.</p>
        </div>
        <button style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          + Request New Course
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {courses.map(course => (
          <div key={course._id} style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ height: '120px', background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}></div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.2rem', lineHeight: '1.4' }}>{course.title}</h3>
                {course.status === 'published' ? (
                  <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 700 }}>LIVE</span>
                ) : (
                  <span style={{ background: '#fef3c7', color: '#b45309', padding: '4px 12px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 700 }}>DRAFT</span>
                )}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>
                <span>👥 {course.studentCount} Students</span>
                <span>⭐ {course.rating.toFixed(1)}</span>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => handleEditClick(course._id)}
                  style={{ flex: 1, background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Edit Curriculum
                </button>
                <button style={{ background: 'white', color: '#4f46e5', border: '1px solid #4f46e5', padding: '10px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                  Analytics
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;
