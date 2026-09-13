import React, { useState, useEffect } from 'react';
import api from '../../api';

const TeacherAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '', content: '', priority: 'normal', courseId: ''
  });

  useEffect(() => {
    fetchAnnouncements();
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/teacher/courses');
      setCourses(res.data);
    } catch (err) {}
  };

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await api.get('/teacher/announcements');
      setAnnouncements(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/teacher/announcements', newAnnouncement);
      setShowAddForm(false);
      setNewAnnouncement({ title: '', content: '', priority: 'normal', courseId: '' });
      fetchAnnouncements();
    } catch (err) {
      alert('Failed to post announcement');
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading Announcements...</div>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#1e293b', margin: '0 0 8px 0', fontWeight: 800 }}>Announcements</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Broadcast important messages to your students.</p>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          {showAddForm ? 'Cancel' : '+ New Announcement'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '24px', borderRadius: '16px', marginBottom: '32px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 16px 0' }}>Post Announcement</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <input required placeholder="Subject / Title" value={newAnnouncement.title} onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            <select value={newAnnouncement.courseId} onChange={e => setNewAnnouncement({...newAnnouncement, courseId: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <option value="">Broadcast to All My Students</option>
              {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>Priority</label>
            <select value={newAnnouncement.priority} onChange={e => setNewAnnouncement({...newAnnouncement, priority: e.target.value})} style={{ width: '200px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          
          <textarea required placeholder="Write your message here..." value={newAnnouncement.content} onChange={e => setNewAnnouncement({...newAnnouncement, content: e.target.value})} style={{ width: '100%', minHeight: '120px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '16px' }} />

          <button type="submit" style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Post Announcement</button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {announcements.length === 0 ? (
          <p style={{ color: '#64748b' }}>No announcements posted yet.</p>
        ) : (
          announcements.map(ann => (
            <div key={ann._id} style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', borderLeft: `6px solid ${ann.priority === 'urgent' ? '#ef4444' : ann.priority === 'high' ? '#f59e0b' : '#3b82f6'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                  {ann.courseId ? ann.courseId.title : 'All Students'}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  {new Date(ann.createdAt).toLocaleString()}
                </span>
              </div>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1.2rem', color: '#1e293b' }}>{ann.title}</h3>
              <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{ann.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherAnnouncements;
