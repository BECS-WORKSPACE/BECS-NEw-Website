import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getCourseLiveClasses } from '../../../api';

const StudentLiveClasses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, we will aggregate live classes from all enrolled courses
    const fetchClasses = async () => {
      try {
        if (!user.enrolledCourses || user.enrolledCourses.length === 0) {
          setLoading(false);
          return;
        }
        
        const promises = user.enrolledCourses.map(courseId => getCourseLiveClasses(courseId));
        const results = await Promise.all(promises);
        
        // Flatten and sort by date
        const allFetchedClasses = results.flat().sort((a, b) => new Date(a.scheduledStartTime) - new Date(b.scheduledStartTime));
        setClasses(allFetchedClasses);
      } catch (err) {
        console.error('Failed to fetch student live classes', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClasses();
  }, [user]);

  // Premium gate
  if (!user?.isPremium) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔒</div>
        <h2 style={{ fontSize: '2rem', color: 'var(--navy)', fontFamily: 'Outfit', fontWeight: 700, marginBottom: '12px' }}>Premium Feature Locked</h2>
        <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '400px', marginBottom: '24px' }}>Subscribe to EduVerse Premium to unlock exclusive live classes, mentorship sessions, and interactive Q&A.</p>
        <button onClick={() => navigate('/dashboard/subscription')} style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #2563eb, #1e40af)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>
          Upgrade to Premium
        </button>
      </div>
    );
  }

  if (loading) return <div style={{ padding: '40px' }}>Loading Upcoming Classes...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontFamily: 'Outfit', color: 'var(--navy)', marginBottom: '8px', fontWeight: 700 }}>Live Classes</h2>
          <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>Join interactive live sessions with expert mentors.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 600, color: 'var(--navy)', cursor: 'pointer' }}>
            📅 Calendar Sync
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {classes.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', background: 'white', padding: '60px', borderRadius: '24px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
            <h3 style={{ color: 'var(--navy)', fontSize: '1.5rem', marginBottom: '8px' }}>No Upcoming Classes</h3>
            <p style={{ color: '#64748b' }}>Your instructors haven't scheduled any live classes for your enrolled courses yet.</p>
          </div>
        ) : (
          classes.map((session) => (
            <div key={session._id} style={{ background: 'white', borderRadius: '24px', border: session.status === 'live' ? '2px solid #ef4444' : '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '24px', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <span style={{ padding: '6px 12px', background: 'rgba(59,130,246,0.1)', color: '#2563eb', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
                    Class Session
                  </span>
                  {session.status === 'live' && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontSize: '0.85rem', fontWeight: 700, animation: 'pulse 2s infinite' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span>
                      LIVE
                    </span>
                  )}
                </div>
                
                <h3 style={{ fontSize: '1.3rem', color: 'var(--navy)', marginBottom: '12px', fontWeight: 700, lineHeight: 1.4 }}>{session.title}</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: '#64748b', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>👨‍🏫</span> <span>{session.instructorId?.name || 'Instructor'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🕒</span> <span>{new Date(session.scheduledStartTime).toLocaleString()} • {session.durationMinutes} Min</span>
                  </div>
                </div>
              </div>
              
              <div style={{ padding: '20px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                <button 
                  onClick={() => navigate(`/dashboard/live-class/${session._id}`)}
                  style={{ 
                    width: '100%', padding: '14px', borderRadius: '12px', 
                    background: session.status === 'live' ? '#ef4444' : 'var(--primary)', 
                    color: 'white', border: 'none', fontWeight: 600, cursor: session.status === 'live' ? 'pointer' : 'not-allowed',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
                    opacity: session.status === 'live' ? 1 : 0.6
                  }}
                  disabled={session.status !== 'live'}
                >
                  {session.status === 'live' ? '▶ Join Live Session' : 'Waiting for Instructor...'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default StudentLiveClasses;
