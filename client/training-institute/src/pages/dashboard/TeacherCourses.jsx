import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const TeacherCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/teacher/courses');
      setCourses(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch assigned courses.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading Courses...</div>;
  if (error) return <div style={{ padding: '40px', color: 'red' }}>{error}</div>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#1e293b', margin: '0 0 8px 0', fontWeight: 800 }}>My Courses</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Manage content, assignments, and tests for your assigned courses.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {courses.length === 0 ? (
          <p style={{ color: '#64748b', gridColumn: '1 / -1', textAlign: 'center', padding: '40px', background: 'white', borderRadius: '16px' }}>
            You have not been assigned any courses yet.
          </p>
        ) : (
          courses.map(course => (
            <div key={course._id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '160px', background: course.image ? `url(${course.image})` : '#cbd5e1', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                  {course.status.toUpperCase()}
                </span>
              </div>
              
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase', background: '#eff6ff', padding: '4px 8px', borderRadius: '4px' }}>
                    {course.category || 'Course'}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>👥 {course.studentCount || 0}</span>
                </div>
                
                <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: '#1e293b', fontWeight: 700, lineHeight: 1.4 }}>{course.title}</h3>
                
                <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                  <button onClick={() => navigate(`/dashboard/curriculum-builder?course=${course._id}`)} style={{ padding: '10px', background: '#f8fafc', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
                    Edit Curriculum
                  </button>
                  <button onClick={() => navigate(`/dashboard/teacher/students?course=${course._id}`)} style={{ padding: '10px', background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
                    View Students
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherCourses;
