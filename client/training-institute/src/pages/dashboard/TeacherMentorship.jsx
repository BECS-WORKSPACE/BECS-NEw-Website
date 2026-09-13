import React, { useState, useEffect } from 'react';
import api from '../../api';

const TeacherMentorship = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [newSlot, setNewSlot] = useState({
    title: '', description: '', scheduledAt: '', durationMinutes: 30, meetingLink: '', courseId: ''
  });
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchSessions();
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/teacher/courses');
      setCourses(res.data);
    } catch (err) {}
  };

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/teacher/mentorship');
      setSessions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/teacher/mentorship', newSlot);
      setShowAddForm(false);
      setNewSlot({ title: '', description: '', scheduledAt: '', durationMinutes: 30, meetingLink: '', courseId: '' });
      fetchSessions();
    } catch (err) {
      alert('Failed to create slot');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/teacher/mentorship/${id}/status`, { status });
      fetchSessions();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading Mentorship Sessions...</div>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#1e293b', margin: '0 0 8px 0', fontWeight: 800 }}>Mentorship</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Create available slots for 1:1 mentorship and guide students.</p>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          {showAddForm ? 'Cancel' : '+ Create Open Slot'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '24px', borderRadius: '16px', marginBottom: '32px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 16px 0' }}>Open a Mentorship Slot</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <input required placeholder="Slot Title (e.g. 1:1 Physics Doubt Clearing)" value={newSlot.title} onChange={e => setNewSlot({...newSlot, title: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            <select value={newSlot.courseId} onChange={e => setNewSlot({...newSlot, courseId: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <option value="">Any Course / Global</option>
              {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>Date & Time</label>
              <input type="datetime-local" required value={newSlot.scheduledAt} onChange={e => setNewSlot({...newSlot, scheduledAt: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>Duration (Mins)</label>
              <input type="number" required value={newSlot.durationMinutes} onChange={e => setNewSlot({...newSlot, durationMinutes: Number(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>Meeting Link</label>
              <input type="url" placeholder="Zoom/Meet Link" value={newSlot.meetingLink} onChange={e => setNewSlot({...newSlot, meetingLink: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
          </div>
          
          <textarea placeholder="Description or prerequisites (optional)" value={newSlot.description} onChange={e => setNewSlot({...newSlot, description: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '16px' }} />

          <button type="submit" style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Publish Slot</button>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {sessions.length === 0 ? (
          <p style={{ color: '#64748b' }}>No sessions created yet.</p>
        ) : (
          sessions.map(sess => (
            <div key={sess._id} style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', background: sess.status === 'booked' ? '#dcfce3' : sess.status === 'available' ? '#e0e7ff' : '#f1f5f9', color: sess.status === 'booked' ? '#166534' : sess.status === 'available' ? '#4f46e5' : '#64748b', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  {sess.status.toUpperCase()}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>⏱ {sess.durationMinutes} mins</span>
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#1e293b' }}>{sess.title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 16px 0' }}>{new Date(sess.scheduledAt).toLocaleString()}</p>
              
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginBottom: '16px' }}>
                {sess.status === 'booked' ? (
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: '#64748b' }}>Booked by:</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '16px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{sess.studentId?.name?.charAt(0) || '?'}</div>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600 }}>{sess.studentId?.name}</span>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{sess.courseId?.title}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>No student has booked this slot yet.</p>
                )}
              </div>

              {sess.status === 'booked' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => window.open(sess.meetingLink, '_blank')} style={{ flex: 1, background: '#2563eb', color: 'white', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                    Join Meeting
                  </button>
                  <button onClick={() => updateStatus(sess._id, 'completed')} style={{ flex: 1, background: '#10b981', color: 'white', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                    Mark Done
                  </button>
                </div>
              )}
              {sess.status === 'available' && (
                <button onClick={() => updateStatus(sess._id, 'cancelled')} style={{ width: '100%', background: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                  Cancel Slot
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherMentorship;
