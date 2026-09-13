import React, { useState, useEffect } from 'react';
import api from '../../api';

const QuestionBank = () => {
  const [filters, setFilters] = useState({ subject: 'All Subjects', difficulty: 'All Levels', type: 'All' });
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.subject !== 'All Subjects') params.subject = filters.subject;
      if (filters.difficulty !== 'All Levels') params.difficulty = filters.difficulty;
      if (filters.type === 'PYQ Only') params.isPYQ = true;
      if (filters.type === 'Standard Only') params.isPYQ = false;

      const res = await api.get(`/questions`, { params });
      if (res.data.success) {
        setQuestions(res.data.questions);
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [filters]);

  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [attemptResult, setAttemptResult] = useState(null);

  const handleSubmit = async () => {
    if (!selectedAnswer) return;
    
    try {
      const currentQ = questions[activeQuestion];
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/questions/attempt`, {
        questionId: currentQ._id,
        studentAnswer: selectedAnswer,
        timeSpentSeconds: 15 // Mock timer for now
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (res.data.success) {
        setIsSubmitted(true);
        setAttemptResult(res.data);
      }
    } catch (err) {
      console.error("Error submitting attempt:", err);
    }
  };

  const [activeTab, setActiveTab] = useState('practice'); // practice, attempted, incorrect, bookmarked

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#1e293b', margin: '0 0 8px 0', fontWeight: 800 }}>Question Bank</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Master concepts with 50,000+ targeted questions & PYQs.</p>
        </div>
        <div style={{ background: 'white', padding: '16px 24px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', gap: '24px' }}>
          <div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Accuracy</p>
            <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#10b981', fontWeight: 800 }}>76%</h4>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Solved</p>
            <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#3b82f6', fontWeight: 800 }}>1,245</h4>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
        {['practice', 'attempted', 'incorrect', 'bookmarked'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ 
              padding: '10px 20px', 
              background: activeTab === tab ? '#eff6ff' : 'transparent', 
              color: activeTab === tab ? '#2563eb' : '#64748b',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '32px', '@media (max-width: 900px)': { gridTemplateColumns: '1fr' } }}>
        
        {/* Filters Sidebar */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#1e293b', marginBottom: '20px', fontWeight: 700 }}>Filters</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', color: '#475569', marginBottom: '8px', fontWeight: 600 }}>Subject</label>
            <select value={filters.subject} onChange={e => setFilters({...filters, subject: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <option>All</option>
              <option>Physics</option>
              <option>Chemistry</option>
              <option>Mathematics</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', color: '#475569', marginBottom: '8px', fontWeight: 600 }}>Difficulty</label>
            <select value={filters.difficulty} onChange={e => setFilters({...filters, difficulty: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <option>All</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', color: '#475569', marginBottom: '8px', fontWeight: 600 }}>Type</label>
            <select value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <option>All Questions</option>
              <option>PYQ Only</option>
              <option>Expected Questions</option>
            </select>
          </div>
        </div>

        {/* Questions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>Loading questions...</div>
          ) : questions.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ color: '#1e293b' }}>No questions found.</h3>
              <p style={{ color: '#64748b' }}>Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              {/* Question Card */}
              <div style={{ background: 'white', borderRadius: '16px', padding: '32px', border: '1px solid #e2e8f0', position: 'relative' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                        {questions[activeQuestion]?.subject}
                      </span>
                      <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                        {questions[activeQuestion]?.chapter}
                      </span>
                      {questions[activeQuestion]?.isPYQ && (
                        <span style={{ background: '#fef3c7', color: '#d97706', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
                          PYQ {questions[activeQuestion]?.pyqYear || ''}
                        </span>
                      )}
                    </div>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b', lineHeight: '1.6' }}>
                      {activeQuestion + 1}. {questions[activeQuestion]?.text || questions[activeQuestion]?.title}
                    </h2>
                  </div>
                  
                  <button style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}>
                    🔖
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(questions[activeQuestion]?.options || []).map((opt, i) => (
                    <button 
                      key={i}
                      onClick={() => !isSubmitted && setSelectedAnswer(opt.text || opt)}
                      style={{
                        padding: '16px 20px',
                        background: selectedAnswer === (opt.text || opt) ? '#eff6ff' : 'white',
                        border: `2px solid ${selectedAnswer === (opt.text || opt) ? '#3b82f6' : '#e2e8f0'}`,
                        borderRadius: '12px',
                        textAlign: 'left',
                        fontSize: '1rem',
                        color: '#1e293b',
                        fontWeight: 500,
                        cursor: isSubmitted ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: selectedAnswer === (opt.text || opt) ? '#3b82f6' : '#f1f5f9', color: selectedAnswer === (opt.text || opt) ? 'white' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>
                        {['A', 'B', 'C', 'D'][i]}
                      </span>
                      {opt.text || opt}
                    </button>
                  ))}
                </div>

                {isSubmitted && attemptResult && (
                  <div style={{ marginTop: '24px', padding: '20px', background: attemptResult.isCorrect ? '#ecfdf5' : '#fef2f2', borderRadius: '12px', border: `1px solid ${attemptResult.isCorrect ? '#a7f3d0' : '#fecaca'}` }}>
                    <h4 style={{ margin: '0 0 8px 0', color: attemptResult.isCorrect ? '#059669' : '#dc2626', fontSize: '1.1rem', fontWeight: 700 }}>
                      {attemptResult.isCorrect ? 'Correct Answer!' : 'Incorrect Answer'}
                    </h4>
                    {!attemptResult.isCorrect && (
                      <p style={{ margin: '0 0 12px 0', color: '#1e293b', fontWeight: 600 }}>
                        Correct Answer: {attemptResult.correctAnswer}
                      </p>
                    )}
                    <p style={{ margin: 0, color: '#475569', lineHeight: '1.6', fontSize: '0.95rem' }}>
                      <span style={{ fontWeight: 700, color: '#1e293b' }}>Explanation:</span> {attemptResult.explanation}
                    </p>
                  </div>
                )}
              </div>

              {/* Navigation Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button 
                  onClick={() => {
                    if(activeQuestion > 0) {
                      setActiveQuestion(prev => prev - 1);
                      setIsSubmitted(false);
                      setSelectedAnswer(null);
                    }
                  }}
                  disabled={activeQuestion === 0}
                  style={{ background: 'white', color: '#475569', border: '1px solid #cbd5e1', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, cursor: activeQuestion === 0 ? 'not-allowed' : 'pointer', opacity: activeQuestion === 0 ? 0.5 : 1 }}
                >
                  Previous
                </button>
                
                {!isSubmitted ? (
                  <button 
                    onClick={handleSubmit}
                    disabled={!selectedAnswer}
                    style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '8px', fontWeight: 700, cursor: !selectedAnswer ? 'not-allowed' : 'pointer', opacity: !selectedAnswer ? 0.5 : 1, boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      if(activeQuestion < questions.length - 1) {
                        setActiveQuestion(prev => prev + 1);
                        setIsSubmitted(false);
                        setSelectedAnswer(null);
                      }
                    }}
                    disabled={activeQuestion === questions.length - 1}
                    style={{ background: '#10b981', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '8px', fontWeight: 700, cursor: activeQuestion === questions.length - 1 ? 'not-allowed' : 'pointer', opacity: activeQuestion === questions.length - 1 ? 0.5 : 1, boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}
                  >
                    Next Question
                  </button>
                )}
              </div>
            </>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionBank;
