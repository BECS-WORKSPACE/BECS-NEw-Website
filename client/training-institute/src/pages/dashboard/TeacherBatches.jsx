import React, { useState, useEffect } from 'react';
import api from '../../api';

const TeacherBatches = () => {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [newBatch, setNewBatch] = useState({
    name: '', courseId: '', maxStudents: 50, startDate: '', endDate: ''
  });

  useEffect(() => {
    fetchBatches();
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/teacher/courses');
      setCourses(res.data);
    } catch (err) {}
  };

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const res = await api.get('/teacher/batches');
      setBatches(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/teacher/batches', newBatch);
      setShowAddForm(false);
      setNewBatch({ name: '', courseId: '', maxStudents: 50, startDate: '', endDate: '' });
      fetchBatches();
    } catch (err) {
      alert('Failed to create batch');
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading Batches...</div>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#1e293b', margin: '0 0 8px 0', fontWeight: 800 }}>Batches</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Organize your students into cohorts and manage their schedules.</p>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          {showAddForm ? 'Cancel' : '+ Create Batch'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '24px', borderRadius: '16px', marginBottom: '32px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 16px 0' }}>New Batch</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <input required placeholder="Batch Name (e.g. Morning Elite 2024)" value={newBatch.name} onChange={e => setNewBatch({...newBatch, name: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            <select required value={newBatch.courseId} onChange={e => setNewBatch({...newBatch, courseId: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <option value="" disabled>Select Course</option>
              {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>Max Students</label>
              <input type="number" required value={newBatch.maxStudents} onChange={e => setNewBatch({...newBatch, maxStudents: Number(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>Start Date</label>
              <input type="date" required value={newBatch.startDate} onChange={e => setNewBatch({...newBatch, startDate: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>End Date</label>
              <input type="date" required value={newBatch.endDate} onChange={e => setNewBatch({...newBatch, endDate: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
          </div>

          <button type="submit" style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Create Batch</button>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {batches.length === 0 ? (
          <p style={{ color: '#64748b' }}>No batches created yet.</p>
        ) : (
          batches.map(batch => (
            <div key={batch._id} style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', background: batch.status === 'active' ? '#dcfce3' : '#f1f5f9', color: batch.status === 'active' ? '#166534' : '#64748b', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  {batch.status ? batch.status.toUpperCase() : 'ACTIVE'}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{batch.students?.length || 0} / {batch.maxStudents} Students</span>
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#1e293b' }}>{batch.name}</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 16px 0' }}>{batch.courseId?.title || 'Unknown Course'}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginBottom: '16px' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b' }}>Start</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>{new Date(batch.startDate).toLocaleDateString()}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b' }}>End</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>{new Date(batch.endDate).toLocaleDateString()}</span>
                </div>
              </div>

              <button style={{ width: '100%', background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                Manage Students
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherBatches;
