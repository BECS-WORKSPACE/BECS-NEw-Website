import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';

const TeacherMockTests = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [newTest, setNewTest] = useState({
    title: '', description: '', durationMinutes: 60, totalMarks: 100, courseId: '', questions: []
  });
  
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchTests();
    fetchQuestions();
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/teacher/courses');
      setCourses(res.data);
    } catch (err) { }
  };

  const fetchQuestions = async () => {
    try {
      const res = await api.get('/teacher/questions');
      setQuestions(res.data);
    } catch (err) { }
  };

  const fetchTests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/teacher/tests');
      setTests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/teacher/tests', newTest);
      setShowAddForm(false);
      setNewTest({ title: '', description: '', durationMinutes: 60, totalMarks: 100, courseId: '', questions: [] });
      fetchTests();
    } catch (err) {
      console.error(err);
      alert('Failed to create test');
    }
  };

  const toggleQuestionSelection = (qId) => {
    setNewTest(prev => {
      const isSelected = prev.questions.includes(qId);
      if (isSelected) {
        return { ...prev, questions: prev.questions.filter(id => id !== qId) };
      } else {
        return { ...prev, questions: [...prev.questions, qId] };
      }
    });
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading Mock Tests...</div>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#1e293b', margin: '0 0 8px 0', fontWeight: 800 }}>Mock Tests</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Create and manage full-length tests from the Question Bank.</p>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          {showAddForm ? 'Cancel' : '+ Create Test'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '24px', borderRadius: '16px', marginBottom: '32px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 16px 0' }}>Create New Mock Test</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <input required placeholder="Test Title" value={newTest.title} onChange={e => setNewTest({...newTest, title: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            <select value={newTest.courseId} onChange={e => setNewTest({...newTest, courseId: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <option value="">No specific course (Global)</option>
              {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>Duration (Minutes)</label>
              <input type="number" required value={newTest.durationMinutes} onChange={e => setNewTest({...newTest, durationMinutes: Number(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>Total Marks</label>
              <input type="number" required value={newTest.totalMarks} onChange={e => setNewTest({...newTest, totalMarks: Number(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
          </div>

          <textarea placeholder="Description" value={newTest.description} onChange={e => setNewTest({...newTest, description: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '16px' }} />
          
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 8px 0' }}>Select Questions from Bank ({newTest.questions.length} selected)</h4>
            <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
              {questions.map(q => (
                <div key={q._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', borderBottom: '1px solid #f1f5f9' }}>
                  <input type="checkbox" checked={newTest.questions.includes(q._id)} onChange={() => toggleQuestionSelection(q._id)} />
                  <div>
                    <span style={{ fontWeight: 600, display: 'block', fontSize: '0.95rem' }}>{q.title}</span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{q.type} | Marks: +{q.marks.positive}/-{q.marks.negative}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Publish Test</button>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {tests.length === 0 ? (
          <p style={{ color: '#64748b' }}>No tests created yet.</p>
        ) : (
          tests.map(test => (
            <div key={test._id} style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', background: '#e0e7ff', color: '#4f46e5', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>{test.status.toUpperCase()}</span>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>⏱ {test.durationMinutes} mins</span>
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#1e293b' }}>{test.title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 16px 0' }}>{test.description || 'No description'}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginBottom: '16px' }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>{test.questions?.length || 0}</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Questions</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>{test.totalMarks}</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Marks</span>
                </div>
              </div>

              <button style={{ width: '100%', background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                View Results
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherMockTests;
