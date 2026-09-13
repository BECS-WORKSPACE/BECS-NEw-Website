import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api'; // Use the default exported axios instance

const ScholarshipTest = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await api.get('/scholarship/test');
        setTest(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTest();
  }, []);

  const handleOptionChange = (qId, option) => {
    setAnswers({ ...answers, [qId]: option });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < test.questions.length) {
      if (!window.confirm("You have unanswered questions. Are you sure you want to submit?")) {
        return;
      }
    }
    
    setIsLoading(true);
    try {
      const res = await api.post('/scholarship/test/submit', {
        testId: test.testId,
        answers
      });
      
      setResult(res.data);
      
      // Update context/local storage with new discount
      if (res.data.appliedDiscount !== undefined) {
        const updatedUser = { ...user, scholarshipDiscount: res.data.appliedDiscount };
        setUser(updatedUser);
        localStorage.setItem('becs_user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      alert('Failed to submit test');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div style={{ padding: '60px', textAlign: 'center' }}>Loading...</div>;
  }

  if (result) {
    return (
      <div style={{ minHeight: '80vh', padding: '40px', background: '#f8fafc', display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', maxWidth: '600px', width: '100%', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', color: '#1e293b', marginBottom: '16px' }}>Test Complete</h2>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎉</div>
          <p style={{ fontSize: '1.2rem', color: '#475569', marginBottom: '8px' }}>Your Score: <strong>{result.score}%</strong></p>
          <p style={{ fontSize: '1.2rem', color: '#475569', marginBottom: '24px' }}>Discount Earned: <strong style={{ color: '#10b981' }}>{result.discountEarned}%</strong></p>
          
          <div style={{ background: '#f1f5f9', padding: '16px', borderRadius: '8px', marginBottom: '32px' }}>
            <p style={{ margin: 0, color: '#1e293b', fontWeight: 600 }}>{result.message}</p>
          </div>

          <button onClick={() => navigate('/dashboard')} className="btn-solid-lg" style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem' }}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!test) {
    return <div style={{ padding: '60px', textAlign: 'center' }}>No test available.</div>;
  }

  return (
    <div style={{ minHeight: '80vh', padding: '40px 20px', background: '#f8fafc' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '2rem', color: '#1e293b', marginBottom: '8px' }}>{test.title}</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>Answer the following questions to earn up to a 50% scholarship discount on course subscriptions.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {test.questions.map((q, index) => (
            <div key={q._id} style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#1e293b', marginBottom: '16px' }}>{index + 1}. {q.questionText}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {q.options.map(opt => (
                  <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '12px', background: answers[q._id] === opt ? '#e0f2fe' : 'white', border: answers[q._id] === opt ? '1px solid #38bdf8' : '1px solid #cbd5e1', borderRadius: '8px', transition: 'all 0.2s' }}>
                    <input 
                      type="radio" 
                      name={q._id} 
                      value={opt} 
                      checked={answers[q._id] === opt}
                      onChange={() => handleOptionChange(q._id, opt)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ color: '#334155' }}>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '40px', textAlign: 'right' }}>
          <button onClick={handleSubmit} className="btn-solid-lg" style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '14px 32px', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 600 }}>
            Submit Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipTest;
