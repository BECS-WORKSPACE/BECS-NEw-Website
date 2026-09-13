import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/lms/my-courses`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.data.success) {
          setCourses(res.data.myCourses);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading your courses...</div>;

  if (courses.length === 0) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <h2 style={{ color: '#1e293b', marginBottom: '16px' }}>No Courses Found</h2>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>You haven't purchased or enrolled in any courses yet.</p>
        <button onClick={() => navigate('/')} style={{ padding: '12px 24px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          Explore Courses
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <h1 style={{ fontSize: '2rem', color: '#1e293b', marginBottom: '24px', fontWeight: 800 }}>My Courses</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {courses.map(c => (
          <div key={c.course._id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '160px', background: '#f1f5f9', position: 'relative' }}>
              {c.course.image ? (
                <img src={c.course.image} alt={c.course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '3rem' }}>📚</div>
              )}
              {c.status === 'expired' && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.2rem' }}>
                  Expired
                </div>
              )}
            </div>
            
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                {c.course.category || 'General'}
              </div>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', color: '#1e293b', lineHeight: 1.4 }}>{c.course.title}</h3>
              
              <div style={{ marginTop: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#64748b', marginBottom: '8px' }}>
                  <span>Progress</span>
                  <span style={{ fontWeight: 600 }}>{c.progress}%</span>
                </div>
                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden', marginBottom: '20px' }}>
                  <div style={{ height: '100%', width: `${c.progress}%`, background: '#10b981', borderRadius: '3px' }}></div>
                </div>
                
                <button 
                  onClick={() => navigate(`/dashboard/course/${c.course._id}`)}
                  style={{ width: '100%', padding: '12px', background: c.status === 'expired' ? '#f1f5f9' : '#1e293b', color: c.status === 'expired' ? '#64748b' : 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                >
                  {c.status === 'expired' ? 'Renew Access' : 'Open Course'}
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
