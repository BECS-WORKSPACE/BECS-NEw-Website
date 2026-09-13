import React, { useState, useEffect } from 'react';
import api from '../../api';

const TeacherDoubts = () => {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoubts();
  }, []);

  const fetchDoubts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/doubts');
      // res.data.doubts because doubtController sends { success: true, doubts: [...] }
      setDoubts(res.data.doubts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (id, answerText) => {
    if (!answerText.trim()) return;
    try {
      await api.put(`/doubts/${id}/answer`, { answerText });
      fetchDoubts();
    } catch (err) {
      alert("Failed to answer doubt");
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading Doubts...</div>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#1e293b', margin: '0 0 8px 0', fontWeight: 800 }}>Doubt Room</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Resolve student queries and help them learn better.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {doubts.length === 0 ? (
          <p style={{ color: '#64748b' }}>No doubts raised yet.</p>
        ) : (
          doubts.map(doubt => (
            <div key={doubt._id} style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {doubt.student?.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h4 style={{ margin: '0', color: '#1e293b' }}>{doubt.student?.name || 'Student'}</h4>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{doubt.subject}</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.8rem', padding: '4px 8px', borderRadius: '12px', background: doubt.status === 'pending' ? '#fef3c7' : '#dcfce3', color: doubt.status === 'pending' ? '#b45309' : '#166534', fontWeight: 600 }}>
                  {doubt.status.toUpperCase()}
                </span>
              </div>
              
              <h3 style={{ margin: '0 0 8px 0', color: '#1e293b', fontSize: '1.1rem' }}>{doubt.title}</h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', margin: '0 0 20px 0', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
                {doubt.text}
              </p>

              {doubt.status === 'pending' ? (
                <div>
                  <textarea id={`answer-${doubt._id}`} placeholder="Write your answer here..." style={{ width: '100%', minHeight: '80px', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '12px' }} />
                  <button onClick={() => {
                    const text = document.getElementById(`answer-${doubt._id}`).value;
                    handleAnswer(doubt._id, text);
                  }} style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                    Submit Answer
                  </button>
                </div>
              ) : (
                <div style={{ padding: '16px', background: '#ecfdf5', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#065f46', fontWeight: 600 }}>Answered by {doubt.answeredBy?.name || 'You'}</p>
                  <p style={{ margin: 0, color: '#064e3b' }}>{doubt.answerText}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherDoubts;
