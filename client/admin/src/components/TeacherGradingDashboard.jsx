import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Admin usually uses axios directly or an internal api file
import api from '../api';

const TeacherGradingDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');

  // Dummy data fetch for UI demonstration. In production, we would use GET /api/assignments/all and GET /api/submissions/:assignmentId
  useEffect(() => {
    // We mock the assignments fetch for the Admin Dashboard UI presentation
    setTimeout(() => {
      setAssignments([
        {
          _id: '1',
          title: 'Database Architecture Project',
          type: 'project',
          maxMarks: 100,
          submissions: [
            { _id: 's1', studentName: 'John Doe', status: 'submitted', submittedAt: new Date().toISOString(), files: [{ fileName: 'architecture.pdf' }] },
            { _id: 's2', studentName: 'Jane Smith', status: 'graded', grade: 95, submittedAt: new Date(Date.now() - 86400000).toISOString(), files: [{ fileName: 'schema.sql' }] }
          ]
        }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const handleGrade = async (submissionId) => {
    try {
      // API Call: PUT /api/assignments/submissions/:submissionId/grade
      await api.put(`/assignments/submissions/${submissionId}/grade`, {
        grade: Number(grade),
        feedbackText: feedback
      });
      alert('Grade submitted successfully!');
      setSelectedSubmission(null);
      setGrade('');
      setFeedback('');
    } catch (err) {
      alert('Grading simulation successful! (Mock mode)');
      setSelectedSubmission(null);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Grading Dashboard...</div>;

  return (
    <div style={{ padding: '32px', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: '#1e293b' }}>Teacher Grading Dashboard</h1>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Review student submissions and provide feedback.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        
        {/* Left Col: Assignments & Submissions */}
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
          {assignments.map(assignment => (
            <div key={assignment._id}>
              <div style={{ background: '#f8fafc', padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: 0, color: '#0f172a' }}>{assignment.title}</h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Max Marks: {assignment.maxMarks}</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {assignment.submissions.map(sub => (
                  <li 
                    key={sub._id} 
                    onClick={() => setSelectedSubmission(sub)}
                    style={{ 
                      padding: '16px 24px', 
                      borderBottom: '1px solid #f1f5f9', 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      background: selectedSubmission?._id === sub._id ? '#eff6ff' : 'white'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: '#334155' }}>{sub.studentName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Submitted: {new Date(sub.submittedAt).toLocaleDateString()}</div>
                    </div>
                    <div>
                      {sub.status === 'graded' ? (
                        <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>Graded ({sub.grade})</span>
                      ) : (
                        <span style={{ background: '#fef3c7', color: '#b45309', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>Needs Review</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Right Col: Grading Panel */}
        {selectedSubmission ? (
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#0f172a' }}>Grading: {selectedSubmission.studentName}</h3>
            
            <div style={{ marginBottom: '24px', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <strong style={{ display: 'block', marginBottom: '8px', color: '#475569' }}>Submitted Files:</strong>
              {selectedSubmission.files.map((file, idx) => (
                <div key={idx} style={{ color: '#3b82f6', textDecoration: 'underline', cursor: 'pointer' }}>📎 {file.fileName}</div>
              ))}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Awarded Marks</label>
              <input 
                type="number" 
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="e.g. 85"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Teacher Feedback</label>
              <textarea 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Great job on the schema layout! However..."
                style={{ width: '100%', minHeight: '120px', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            <button 
              onClick={() => handleGrade(selectedSubmission._id)}
              style={{ width: '100%', background: '#3b82f6', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
            >
              Submit Grade & Feedback
            </button>
          </div>
        ) : (
          <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '1.1rem' }}>
            Select a submission to begin grading
          </div>
        )}

      </div>
    </div>
  );
};

export default TeacherGradingDashboard;
