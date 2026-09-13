import React, { useState, useEffect } from 'react';
import api from '../../api';

const TeacherQuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [newQuestion, setNewQuestion] = useState({
    title: '', content: '', type: 'single_mcq', difficulty: 3, 
    options: [{ text: '', isCorrect: true }, { text: '', isCorrect: false }],
    marks: { positive: 4, negative: 1 }, tags: ''
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/teacher/questions');
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOption = () => {
    setNewQuestion({
      ...newQuestion,
      options: [...newQuestion.options, { text: '', isCorrect: false }]
    });
  };

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index][field] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newQuestion,
        tags: newQuestion.tags.split(',').map(t => t.trim())
      };
      await api.post('/teacher/questions', payload);
      setShowAddForm(false);
      setNewQuestion({
        title: '', content: '', type: 'single_mcq', difficulty: 3, 
        options: [{ text: '', isCorrect: true }, { text: '', isCorrect: false }],
        marks: { positive: 4, negative: 1 }, tags: ''
      });
      fetchQuestions();
    } catch (err) {
      console.error(err);
      alert('Failed to add question');
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading Question Bank...</div>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#1e293b', margin: '0 0 8px 0', fontWeight: 800 }}>Question Bank</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Create and manage questions for mock tests and practice.</p>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          {showAddForm ? 'Cancel' : '+ Add Question'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '24px', borderRadius: '16px', marginBottom: '32px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 16px 0' }}>Add New Question</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <input required placeholder="Short Title" value={newQuestion.title} onChange={e => setNewQuestion({...newQuestion, title: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            <select value={newQuestion.type} onChange={e => setNewQuestion({...newQuestion, type: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <option value="single_mcq">Single Choice MCQ</option>
              <option value="multi_mcq">Multiple Choice MCQ</option>
            </select>
          </div>

          <textarea required placeholder="Question Content (Supports Markdown)" value={newQuestion.content} onChange={e => setNewQuestion({...newQuestion, content: e.target.value})} style={{ width: '100%', minHeight: '100px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '16px' }} />
          
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 8px 0' }}>Options</h4>
            {newQuestion.options.map((opt, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '8px', alignItems: 'center' }}>
                <input type={newQuestion.type === 'single_mcq' ? 'radio' : 'checkbox'} checked={opt.isCorrect} onChange={(e) => {
                  if (newQuestion.type === 'single_mcq') {
                    const newOpts = newQuestion.options.map((o, idx) => ({ ...o, isCorrect: idx === i }));
                    setNewQuestion({ ...newQuestion, options: newOpts });
                  } else {
                    handleOptionChange(i, 'isCorrect', e.target.checked);
                  }
                }} />
                <input required placeholder={`Option ${i + 1}`} value={opt.text} onChange={e => handleOptionChange(i, 'text', e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </div>
            ))}
            <button type="button" onClick={handleAddOption} style={{ background: '#f1f5f9', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', marginTop: '4px' }}>+ Add Option</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>Positive Marks</label>
              <input type="number" required value={newQuestion.marks.positive} onChange={e => setNewQuestion({...newQuestion, marks: { ...newQuestion.marks, positive: Number(e.target.value) }})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>Negative Marks</label>
              <input type="number" required value={newQuestion.marks.negative} onChange={e => setNewQuestion({...newQuestion, marks: { ...newQuestion.marks, negative: Number(e.target.value) }})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
          </div>
          
          <input placeholder="Tags (comma separated)" value={newQuestion.tags} onChange={e => setNewQuestion({...newQuestion, tags: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '16px' }} />

          <button type="submit" style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Save Question</button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {questions.length === 0 ? (
          <p style={{ color: '#64748b' }}>No questions found in the bank.</p>
        ) : (
          questions.map(q => (
            <div key={q._id} style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', background: '#e0e7ff', color: '#4f46e5', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>{q.type.toUpperCase().replace('_', ' ')}</span>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>+{q.marks?.positive || 1} / -{q.marks?.negative || 0}</span>
              </div>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: '#1e293b' }}>{q.title}</h3>
              <p style={{ fontSize: '0.95rem', color: '#475569', margin: '0 0 16px 0', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>{q.content}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {q.options?.map((opt, i) => (
                  <div key={i} style={{ padding: '8px 12px', borderRadius: '6px', border: `1px solid ${opt.isCorrect ? '#10b981' : '#e2e8f0'}`, background: opt.isCorrect ? '#ecfdf5' : 'white', color: opt.isCorrect ? '#065f46' : '#64748b', fontSize: '0.9rem' }}>
                    {opt.text} {opt.isCorrect && '✓'}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                {q.tags?.map((t, i) => (
                  <span key={i} style={{ fontSize: '0.75rem', background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: '12px' }}>#{t}</span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherQuestionBank;
