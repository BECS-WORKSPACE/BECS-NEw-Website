const fs = require('fs');
const newContent = `
import React, { useState, useEffect } from 'react';
import api from '../../api';

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Assignment Modal State
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [assignedCourseIds, setAssignedCourseIds] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTeachersAndCourses = async () => {
      try {
        const [resTeachers, resCourses] = await Promise.all([
          api.get('/admin-v2/teachers'),
          api.get('/admin-v2/courses')
        ]);
        if (resTeachers.data.success) setTeachers(resTeachers.data.data);
        if (resCourses.data.success) setCourses(resCourses.data.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachersAndCourses();
  }, []);

  const openAssignModal = async (teacher) => {
    setSelectedTeacher(teacher);
    setAssignedCourseIds([]);
    try {
      const res = await api.get(\`/admin-v2/teachers/\${teacher._id}/courses\`);
      if (res.data.success) {
        setAssignedCourseIds(res.data.data.map(c => c._id));
      }
    } catch (err) {
      console.error('Error fetching teacher courses:', err);
    }
  };

  const toggleCourse = (courseId) => {
    if (assignedCourseIds.includes(courseId)) {
      setAssignedCourseIds(assignedCourseIds.filter(id => id !== courseId));
    } else {
      setAssignedCourseIds([...assignedCourseIds, courseId]);
    }
  };

  const saveAssignments = async () => {
    if (!selectedTeacher) return;
    setSaving(true);
    try {
      await api.put(\`/admin-v2/teachers/\${selectedTeacher._id}/courses\`, { courseIds: assignedCourseIds });
      alert('Courses assigned successfully!');
      setSelectedTeacher(null);
    } catch (err) {
      console.error('Error saving assignments:', err);
      alert('Failed to save assignments');
    } finally {
      setSaving(false);
    }
  };

  const filteredTeachers = teachers.filter(t => 
    t.name?.toLowerCase().includes(search.toLowerCase()) || 
    t.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#0f172a', margin: '0 0 8px 0', fontWeight: 800 }}>Teachers</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Manage teaching staff and course assignments.</p>
        </div>
        <button style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
          + Add Teacher
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '16px' }}>
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
          />
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Loading teachers...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Teacher Name</th>
                <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Email</th>
                <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Status</th>
                <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map(teacher => (
                  <tr key={teacher._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '16px 24px', fontWeight: 600, color: '#1e293b' }}>{teacher.name || 'N/A'}</td>
                    <td style={{ padding: '16px 24px', color: '#64748b' }}>{teacher.email}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, background: teacher.status === 'active' ? '#dcfce3' : '#fee2e2', color: teacher.status === 'active' ? '#166534' : '#991b1b' }}>
                        {teacher.status || 'active'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <button 
                        onClick={() => openAssignModal(teacher)}
                        style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '6px', color: '#3b82f6', cursor: 'pointer', fontWeight: 600, marginRight: '16px' }}
                      >
                        Assign Courses
                      </button>
                      <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 600 }}>Revoke</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No teachers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {selectedTeacher && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginTop: 0, marginBottom: '24px' }}>Assign Courses to {selectedTeacher.name}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {courses.map(c => (
                <label key={c._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', background: assignedCourseIds.includes(c._id) ? '#eff6ff' : 'white' }}>
                  <input 
                    type="checkbox" 
                    checked={assignedCourseIds.includes(c._id)} 
                    onChange={() => toggleCourse(c._id)} 
                    style={{ width: '18px', height: '18px' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600 }}>{c.title}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{c.category} | {c.level}</div>
                  </div>
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
              <button onClick={() => setSelectedTeacher(null)} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={saveAssignments} disabled={saving} style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? 'Saving...' : 'Save Assignments'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeachers;
`;
fs.writeFileSync('client/training-institute/src/pages/admin/AdminTeachers.jsx', newContent);
