import React, { useState, useEffect } from 'react';
import api from '../../api';

const TeacherAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  // Form State
  const [newAssignment, setNewAssignment] = useState({
    title: '', description: '', instructions: '', courseId: '', maxMarks: 100, dueDate: ''
  });

  useEffect(() => {
    fetchAssignments();
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/teacher/courses');
      setCourses(res.data);
    } catch (err) {}
  };

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/teacher/assignments');
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      const res = await api.get(`/teacher/submissions?assignmentId=${assignmentId}`);
      setSubmissions(res.data);
      setSelectedAssignment(assignmentId);
    } catch (err) {
      alert("Failed to load submissions");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/teacher/assignments', newAssignment);
      setShowAddForm(false);
      fetchAssignments();
    } catch (err) {
      alert('Failed to create assignment');
    }
  };

  const evaluateSubmission = async (submissionId, grade, feedbackText) => {
    try {
      await api.put(`/teacher/submissions/${submissionId}/evaluate`, { grade, feedbackText });
      alert("Evaluation saved!");
      fetchSubmissions(selectedAssignment);
    } catch (err) {
      alert("Evaluation failed");
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading Assignments...</div>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#1e293b', margin: '0 0 8px 0', fontWeight: 800 }}>Assignments</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Create assignments and evaluate student submissions.</p>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          {showAddForm ? 'Cancel' : '+ Create Assignment'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '24px', borderRadius: '16px', marginBottom: '32px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 16px 0' }}>New Assignment</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <input required placeholder="Assignment Title" value={newAssignment.title} onChange={e => setNewAssignment({...newAssignment, title: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            <select required value={newAssignment.courseId} onChange={e => setNewAssignment({...newAssignment, courseId: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <option value="" disabled>Select Course</option>
              {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
            <input type="number" required placeholder="Max Marks" value={newAssignment.maxMarks} onChange={e => setNewAssignment({...newAssignment, maxMarks: Number(e.target.value)})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            <input type="datetime-local" required value={newAssignment.dueDate} onChange={e => setNewAssignment({...newAssignment, dueDate: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
          </div>
          
          <textarea required placeholder="Instructions for students" value={newAssignment.instructions} onChange={e => setNewAssignment({...newAssignment, instructions: e.target.value})} style={{ width: '100%', minHeight: '100px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '16px' }} />

          <button type="submit" style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Publish Assignment</button>
        </form>
      )}

      {selectedAssignment ? (
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <button onClick={() => setSelectedAssignment(null)} style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', marginBottom: '16px', fontWeight: 600 }}>← Back to Assignments</button>
          <h3 style={{ margin: '0 0 16px 0' }}>Submissions</h3>
          
          {submissions.length === 0 ? <p>No submissions yet.</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Student</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Score</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map(sub => (
                  <tr key={sub._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px' }}>{sub.studentId?.name || 'Unknown'}</td>
                    <td style={{ padding: '12px' }}>{sub.status}</td>
                    <td style={{ padding: '12px' }}>{sub.grade || '-'}/{sub.assignmentId?.maxMarks}</td>
                    <td style={{ padding: '12px' }}>
                      {sub.status === 'submitted' || sub.status === 'graded' ? (
                        <button onClick={() => {
                          const grade = prompt("Enter Grade:", sub.grade || 0);
                          if(grade !== null) {
                            const feedback = prompt("Enter Feedback (optional):", sub.feedbackText || "");
                            evaluateSubmission(sub._id, Number(grade), feedback);
                          }
                        }} style={{ padding: '6px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                          {sub.status === 'graded' ? 'Update Grade' : 'Evaluate'}
                        </button>
                      ) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {assignments.length === 0 ? (
            <p style={{ color: '#64748b' }}>No assignments created yet.</p>
          ) : (
            assignments.map(ass => (
              <div key={ass._id} style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>{ass.title}</h3>
                <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '16px' }}>Due: {new Date(ass.dueDate).toLocaleDateString()}</span>
                
                <button onClick={() => fetchSubmissions(ass._id)} style={{ width: '100%', background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                  View Submissions
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherAssignments;
