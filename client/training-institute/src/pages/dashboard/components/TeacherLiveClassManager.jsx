import React, { useState, useEffect } from 'react';
import { getInstructorLiveClasses, scheduleLiveClass } from '../../../api';
import api from '../../../api'; // Assuming you might need raw api calls for courses

const TeacherLiveClassManager = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [courses, setCourses] = useState([]);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [scheduledStartTime, setScheduledStartTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [classRes, courseRes] = await Promise.all([
        getInstructorLiveClasses(),
        api.get('/courses') // Get all courses to populate dropdown
      ]);
      setClasses(classRes);
      setCourses(courseRes.data.courses || courseRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    try {
      await scheduleLiveClass({
        title,
        description,
        courseId,
        scheduledStartTime,
        durationMinutes
      });
      setShowModal(false);
      fetchData(); // Refresh list
    } catch (error) {
      alert('Failed to schedule class. Check console for details.');
      console.error(error);
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading Live Classes...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontFamily: 'Outfit', color: 'var(--navy)', marginBottom: '8px', fontWeight: 700 }}>Live Class Manager</h2>
          <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>Schedule and manage your interactive enterprise sessions.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          style={{ padding: '12px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #2563eb, #1e40af)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}
        >
          + Schedule New Class
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>CLASS TITLE</th>
              <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>COURSE</th>
              <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>START TIME</th>
              <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>STATUS</th>
              <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: 600, fontSize: '0.85rem', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {classes.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>No classes scheduled yet.</td></tr>
            ) : (
              classes.map((cls) => (
                <tr key={cls._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 24px', color: 'var(--navy)', fontWeight: 600 }}>{cls.title}</td>
                  <td style={{ padding: '16px 24px', color: '#64748b' }}>{cls.courseId?.title || 'Unknown Course'}</td>
                  <td style={{ padding: '16px 24px', color: '#64748b' }}>{new Date(cls.scheduledStartTime).toLocaleString()}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600,
                      background: cls.status === 'live' ? '#fee2e2' : '#e0e7ff',
                      color: cls.status === 'live' ? '#ef4444' : '#4f46e5'
                    }}>
                      {cls.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button 
                      onClick={() => window.location.href = `/dashboard/live-class/${cls._id}`}
                      style={{ padding: '8px 16px', background: 'var(--primary)', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Start Class
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '24px', fontFamily: 'Outfit', fontWeight: 700 }}>Schedule Live Class</h3>
            
            <form onSubmit={handleSchedule} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>Class Title</label>
                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', boxSizing: 'border-box' }} placeholder="e.g. Advanced System Design" />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>Associated Course</label>
                <select required value={courseId} onChange={e => setCourseId(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', boxSizing: 'border-box' }}>
                  <option value="">Select a Course...</option>
                  {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>Start Date & Time</label>
                <input type="datetime-local" required value={scheduledStartTime} onChange={e => setScheduledStartTime(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>Duration (Minutes)</label>
                <input type="number" required value={durationMinutes} onChange={e => setDurationMinutes(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '14px', background: '#f1f5f9', color: '#475569', borderRadius: '12px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '14px', background: 'var(--primary)', color: 'white', borderRadius: '12px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Schedule Class</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherLiveClassManager;
