import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuestionPalette from './components/QuestionPalette';
import api from '../../api';

const LiveExamEngine = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [testConfig, setTestConfig] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paletteState, setPaletteState] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timerRef = useRef(null);
  const autosaveInterval = useRef(null);
  const warningsLog = useRef([]);

  // Fetch initial test state or resume existing attempt
  useEffect(() => {
    const initializeExam = async () => {
      try {
        const res = await api.post(`/tests/attempts/start/${testId}`);
        const { attemptId, test, endTime, savedState } = res.data;
        
        setTestConfig(test);
        setAttemptId(attemptId);
        setPaletteState(savedState);
        
        // Calculate remaining time safely based on server endTime
        const msRemaining = new Date(endTime) - new Date();
        setTimeRemaining(Math.max(0, Math.floor(msRemaining / 1000)));

        // Basic anti-cheat
        document.addEventListener('visibilitychange', handleVisibilityChange);

        setLoading(false);
      } catch (error) {
        console.error('Failed to initialize exam:', error);
        alert('Failed to load exam. Please try again.');
        navigate('/dashboard/tests');
      }
    };
    initializeExam();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(timerRef.current);
      clearInterval(autosaveInterval.current);
    };
  }, [testId, navigate]);

  // Anti-cheat handler
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      warningsLog.current.push({ type: 'tab_switch', timestamp: new Date() });
      triggerAutosave();
    }
  };

  // Timer Tick
  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmit(true); // Auto-submit when time expires
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timeRemaining]);

  // Heartbeat Autosave (Every 30 secs)
  useEffect(() => {
    if (!loading && attemptId) {
      autosaveInterval.current = setInterval(() => {
        triggerAutosave();
      }, 30000);
    }
    return () => clearInterval(autosaveInterval.current);
  }, [loading, attemptId, paletteState]);

  const triggerAutosave = async () => {
    if (!attemptId) return;
    try {
      await api.put(`/tests/attempts/${attemptId}/autosave`, {
        answers: paletteState,
        warnings: warningsLog.current
      });
      warningsLog.current = []; // Clear flush
    } catch (err) {
      console.warn('Background auto-save failed', err);
    }
  };

  const updatePaletteState = (updates) => {
    setPaletteState(prev => prev.map(s => s.questionId === currentQuestion._id ? { ...s, ...updates } : s));
  };

  const handleOptionSelect = (optionId) => {
    const currentState = paletteState.find(s => s.questionId === currentQuestion._id);
    let newSelection = [];
    
    if (currentQuestion.type === 'multi_mcq') {
      // Toggle
      if (currentState?.selectedOptionIds?.includes(optionId)) {
        newSelection = currentState.selectedOptionIds.filter(id => id !== optionId);
      } else {
        newSelection = [...(currentState?.selectedOptionIds || []), optionId];
      }
    } else {
      // Single
      newSelection = [optionId];
    }

    updatePaletteState({ 
      selectedOptionIds: newSelection,
      status: newSelection.length > 0 ? 'answered' : 'visited_unanswered' 
    });
  };

  const handleMarkReview = () => {
    updatePaletteState({ status: 'marked_for_review' });
    navigateNext();
  };

  const handleSaveAndNext = () => {
    const currentState = paletteState.find(s => s.questionId === currentQuestion._id);
    if (currentState?.status === 'not_visited') {
      updatePaletteState({ status: 'visited_unanswered' });
    }
    navigateNext();
  };

  const navigateNext = () => {
    if (currentIndex < testConfig.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
    // Force a save when navigating
    setTimeout(triggerAutosave, 100);
  };

  const handleSubmit = async (isAutoSubmit = false) => {
    if (!isAutoSubmit && !window.confirm("Are you sure you want to final submit the test? You cannot undo this.")) return;
    
    setIsSubmitting(true);
    await triggerAutosave(); // Final flush
    try {
      const res = await api.post(`/tests/attempts/${attemptId}/submit`);
      navigate(`/dashboard/test/results/${res.data.resultId}`);
    } catch (err) {
      alert('Submission failed. Please check your connection and try again.');
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return <div style={{ padding: '60px', textAlign: 'center' }}>Loading Exam Environment...</div>;

  const currentQuestion = testConfig.questions[currentIndex];
  const currentState = paletteState.find(s => s.questionId === currentQuestion._id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', background: 'var(--navy)', color: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>{testConfig.title}</h1>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: timeRemaining < 300 ? '#ef4444' : 'white' }}>
            ⏱ {formatTime(timeRemaining)}
          </div>
          <button 
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            style={{ padding: '8px 24px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Test'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Main Canvas */}
        <div style={{ flex: 1, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', border: '1px solid #e2e8f0', flex: 1, boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy)' }}>Question {currentIndex + 1}</span>
              <span style={{ background: '#f1f5f9', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
                +{currentQuestion.marks.positive} / -{currentQuestion.marks.negative} Marks
              </span>
            </div>

            <div style={{ fontSize: '1.1rem', color: '#1e293b', lineHeight: 1.6, marginBottom: '32px' }}>
              {currentQuestion.content}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {currentQuestion.options?.map(opt => {
                const isSelected = currentState?.selectedOptionIds?.includes(opt._id);
                return (
                  <label 
                    key={opt._id} 
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', 
                      border: isSelected ? '2px solid #3b82f6' : '1px solid #cbd5e1', 
                      borderRadius: '12px', cursor: 'pointer', background: isSelected ? '#eff6ff' : 'white',
                      transition: 'all 0.2s'
                    }}
                  >
                    <input 
                      type={currentQuestion.type === 'multi_mcq' ? 'checkbox' : 'radio'}
                      name={`question_${currentQuestion._id}`}
                      checked={isSelected || false}
                      onChange={() => handleOptionSelect(opt._id)}
                      style={{ width: '20px', height: '20px', accentColor: '#3b82f6' }}
                    />
                    <span style={{ fontSize: '1rem', color: '#334155' }}>{opt.text}</span>
                  </label>
                );
              })}
              
              {currentQuestion.type === 'numerical' && (
                <input 
                  type="number" 
                  placeholder="Enter numerical answer..."
                  value={currentState?.numericalValue || ''}
                  onChange={(e) => updatePaletteState({ numericalValue: parseFloat(e.target.value), status: e.target.value ? 'answered' : 'visited_unanswered' })}
                  style={{ padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1.1rem', maxWidth: '300px' }}
                />
              )}
            </div>

          </div>

          {/* Action Bar */}
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => updatePaletteState({ status: 'visited_unanswered', selectedOptionIds: [], numericalValue: null })}
                style={{ padding: '12px 24px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#64748b', fontWeight: 600, cursor: 'pointer' }}
              >
                Clear Response
              </button>
              <button 
                onClick={handleMarkReview}
                style={{ padding: '12px 24px', background: '#a855f7', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}
              >
                Mark for Review & Next
              </button>
            </div>
            <button 
              onClick={handleSaveAndNext}
              style={{ padding: '12px 32px', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}
            >
              Save & Next
            </button>
          </div>
        </div>

        {/* Right Sidebar - Palette */}
        <div style={{ width: '320px', padding: '32px 32px 32px 0' }}>
          <QuestionPalette 
            questions={testConfig.questions} 
            currentQuestionIndex={currentIndex} 
            setCurrentQuestionIndex={setCurrentIndex}
            paletteState={paletteState} 
          />
        </div>
      </div>
    </div>
  );
};

export default LiveExamEngine;
