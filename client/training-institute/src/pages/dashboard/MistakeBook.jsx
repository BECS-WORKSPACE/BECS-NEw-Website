import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MistakeBook = () => {
  const [filterSubject, setFilterSubject] = useState('All');
  const [mistakes, setMistakes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMistakes = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/questions/mistakes`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.data.success) {
          setMistakes(res.data.mistakes);
        }
      } catch (err) {
        console.error("Error fetching mistakes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMistakes();
  }, []);

  const filtered = filterSubject === 'All' ? mistakes : mistakes.filter(m => m.subject === filterSubject || m.question?.subject === filterSubject);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading mistake book...</div>;
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', color: '#1e293b', margin: '0 0 8px 0', fontWeight: 800 }}>Mistake Book</h1>
        <p style={{ color: '#64748b', margin: 0 }}>Review the questions you answered incorrectly to identify weak areas.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ color: '#1e293b' }}>No mistakes found!</h3>
            <p style={{ color: '#64748b' }}>You are doing great.</p>
          </div>
        ) : (
          filtered.map((m, i) => {
            const q = m.question;
            if (!q) return null;
            
            let correctText = '';
            if (q.options) {
              const correctOpt = q.options.find(o => o.isCorrect);
              if (correctOpt) correctText = correctOpt.text;
            }

            return (
              <div key={i} style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 8px', background: '#f1f5f9', color: '#475569', borderRadius: '6px' }}>{q.subject}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 8px', background: '#f1f5f9', color: '#475569', borderRadius: '6px' }}>{q.chapter || q.topic}</span>
                  </div>
                  
                  <h3 style={{ fontSize: '1.1rem', color: '#1e293b', margin: '0 0 20px 0', lineHeight: 1.5 }}>
                    {q.text || q.title}
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                    <div>
                      <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Your Answer</p>
                      <p style={{ margin: 0, color: '#ef4444', fontWeight: 500 }}>{m.studentAnswer || 'Skipped'}</p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Correct Answer</p>
                      <p style={{ margin: 0, color: '#10b981', fontWeight: 500 }}>{correctText}</p>
                    </div>
                  </div>
                </div>
                
                <div style={{ padding: '20px 24px', background: '#f8fafc' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: '#1e293b' }}>Explanation</h4>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', lineHeight: 1.6 }}>
                    {q.explanation || q.correctExplanation || 'No explanation available.'}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MistakeBook;
