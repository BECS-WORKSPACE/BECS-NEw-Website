import React, { useState, useEffect } from 'react';
import api from '../../api';

const TeacherAttendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [newAttendance, setNewAttendance] = useState({
    courseId: '', batchId: '', date: new Date().toISOString().split('T')[0], type: 'live_class', topic: '', records: []
  });

  useEffect(() => {
    fetchAttendances();
    fetchCourses();
    fetchBatches();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/teacher/courses');
      setCourses(res.data);
    } catch (err) {}
  };

  const fetchBatches = async () => {
    try {
      const res = await api.get('/teacher/batches');
      setBatches(res.data);
    } catch (err) {}
  };

  const fetchAttendances = async () => {
    try {
      setLoading(true);
      const res = await api.get('/teacher/attendance');
      setAttendances(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseBatchSelect = async () => {
    if (!newAttendance.courseId) return;
    try {
      // Fetch students for this course/batch
      const res = await api.get(`/teacher/students?courseId=${newAttendance.courseId}`);
      setStudents(res.data);
      // Initialize records
      const initialRecords = res.data.map(s => ({
        studentId: s.user._id,
        name: s.user.name,
        status: 'present',
        remarks: ''
      }));
      setNewAttendance(prev => ({ ...prev, records: initialRecords }));
    } catch(err) {
      alert("Failed to load students for attendance.");
    }
  };

  useEffect(() => {
    if(newAttendance.courseId) {
      handleCourseBatchSelect();
    }
  }, [newAttendance.courseId, newAttendance.batchId]);

  const updateRecordStatus = (index, status) => {
    const updated = [...newAttendance.records];
    updated[index].status = status;
    setNewAttendance(prev => ({ ...prev, records: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Map records to just studentId, status, remarks
      const payload = {
        ...newAttendance,
        records: newAttendance.records.map(r => ({ studentId: r.studentId, status: r.status, remarks: r.remarks }))
      };
      await api.post('/teacher/attendance', payload);
      setShowAddForm(false);
      fetchAttendances();
    } catch (err) {
      alert('Failed to mark attendance');
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading Attendance...</div>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#1e293b', margin: '0 0 8px 0', fontWeight: 800 }}>Attendance</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Mark and view attendance for your classes.</p>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          {showAddForm ? 'Cancel' : '+ Mark Attendance'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '24px', borderRadius: '16px', marginBottom: '32px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 16px 0' }}>Mark New Attendance</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <select required value={newAttendance.courseId} onChange={e => setNewAttendance({...newAttendance, courseId: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <option value="" disabled>Select Course</option>
              {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
            <select value={newAttendance.batchId} onChange={e => setNewAttendance({...newAttendance, batchId: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <option value="">Select Batch (Optional)</option>
              {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
            <input type="date" required value={newAttendance.date} onChange={e => setNewAttendance({...newAttendance, date: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '24px' }}>
            <select value={newAttendance.type} onChange={e => setNewAttendance({...newAttendance, type: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <option value="live_class">Live Class</option>
              <option value="offline_class">Offline Class</option>
            </select>
            <input required placeholder="Topic Taught (e.g. Thermodynamics Part 1)" value={newAttendance.topic} onChange={e => setNewAttendance({...newAttendance, topic: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
          </div>

          {newAttendance.courseId && newAttendance.records.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>Student Roster</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {newAttendance.records.map((rec, idx) => (
                    <tr key={rec.studentId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 8px' }}>{rec.name}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <select value={rec.status} onChange={(e) => updateRecordStatus(idx, e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="late">Late</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button type="submit" disabled={!newAttendance.courseId || newAttendance.records.length === 0} style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', opacity: (!newAttendance.courseId || newAttendance.records.length === 0) ? 0.5 : 1 }}>Submit Attendance</button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {attendances.length === 0 ? (
          <p style={{ color: '#64748b' }}>No attendance records found.</p>
        ) : (
          attendances.map(att => (
            <div key={att._id} style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0' }}>{new Date(att.date).toLocaleDateString()} - {att.courseId?.title}</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Topic: {att.topic} | {att.type.replace('_', ' ')}</p>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 700, color: '#10b981' }}>{att.records.filter(r => r.status === 'present').length}</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Present</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 700, color: '#ef4444' }}>{att.records.filter(r => r.status === 'absent').length}</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Absent</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherAttendance;
