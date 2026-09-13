import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [syllabus, setSyllabus] = useState([]);
  const [access, setAccess] = useState(false);
  const [accessStatus, setAccessStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/lms/course/${id}/syllabus`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.data.success) {
          setCourse(res.data.course);
          setSyllabus(res.data.syllabus);
          setAccess(res.data.hasAccess);
          setAccessStatus(res.data.accessStatus);
        }
      } catch (err) {
        console.error("Error fetching syllabus:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSyllabus();
  }, [id]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading course content...</div>;
  if (!course) return <div style={{ padding: '40px', textAlign: 'center' }}>Course not found.</div>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Course Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '16px', padding: '32px', color: 'white', marginBottom: '24px' }}>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', marginBottom: '16px' }}>
          ← Back to Dashboard
        </button>
        <h1 style={{ fontSize: '2rem', margin: '0 0 8px 0', fontWeight: 800 }}>{course.title}</h1>
        <p style={{ margin: 0, color: '#cbd5e1' }}>Complete Syllabus & Learning Path</p>
        
        {!access && (
          <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', color: '#fca5a5' }}>
            <strong>{accessStatus === 'expired' ? 'Subscription Expired' : 'Access Locked'}</strong> - You need an active subscription to access this content.
          </div>
        )}
      </div>

      {/* Syllabus Tree */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {syllabus.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>No content available yet.</div>
        ) : syllabus.map((mod, mIndex) => (
          <div key={mod._id} style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ background: '#f8fafc', padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>Module {mIndex + 1}: {mod.title}</h3>
            </div>
            
            <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {mod.chapters.map((ch, cIndex) => (
                <div key={ch._id}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#475569' }}>{ch.title}</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {ch.lessons.map(lesson => (
                      <div 
                        key={lesson._id} 
                        style={{ 
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                          padding: '12px 16px', background: '#f1f5f9', borderRadius: '8px',
                          opacity: lesson.isLocked ? 0.6 : 1
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '1.2rem' }}>
                            {lesson.type === 'video' ? '📺' : lesson.type === 'pdf' ? '📄' : '📝'}
                          </span>
                          <span style={{ color: '#1e293b', fontWeight: 500, textDecoration: lesson.isCompleted ? 'line-through' : 'none' }}>
                            {lesson.title}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          {lesson.isCompleted && <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>✓ Completed</span>}
                          
                          <button 
                            disabled={lesson.isLocked}
                            onClick={() => navigate(`/dashboard/lesson/${lesson._id}`)}
                            style={{ 
                              background: lesson.isLocked ? '#cbd5e1' : '#3b82f6', 
                              color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', 
                              fontWeight: 600, cursor: lesson.isLocked ? 'not-allowed' : 'pointer' 
                            }}
                          >
                            {lesson.isLocked ? 'Locked' : lesson.isCompleted ? 'Review' : 'Start'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseViewer;
