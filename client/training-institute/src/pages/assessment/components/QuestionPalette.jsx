import React from 'react';

const QuestionPalette = ({ questions, currentQuestionIndex, setCurrentQuestionIndex, paletteState }) => {
  // paletteState is an array of objects mapping questionId to status
  
  const getStatusColor = (questionId, index) => {
    if (index === currentQuestionIndex) return 'border-2 border-blue-600 bg-blue-50 text-blue-700';
    
    const state = paletteState.find(s => s.questionId === questionId);
    if (!state) return 'bg-gray-100 text-gray-600 border border-gray-200';

    switch (state.status) {
      case 'answered': return 'bg-green-500 text-white border-none';
      case 'marked_for_review': return 'bg-purple-500 text-white border-none';
      case 'visited_unanswered': return 'bg-red-500 text-white border-none';
      default: return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '16px' }}>Question Palette</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', flex: 1, overflowY: 'auto', alignContent: 'start' }}>
        {questions.map((q, index) => (
          <button
            key={q._id}
            onClick={() => setCurrentQuestionIndex(index)}
            className={getStatusColor(q._id, index)}
            style={{
              aspectRatio: '1',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#64748b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#22c55e' }}></div> Answered
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#ef4444' }}></div> Not Answered
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#a855f7' }}></div> Marked for Review
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#f1f5f9', border: '1px solid #cbd5e1' }}></div> Not Visited
        </div>
      </div>
    </div>
  );
};

export default QuestionPalette;
