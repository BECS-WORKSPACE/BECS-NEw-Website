import React, { useState } from 'react';

const QuestionBank = () => {
  const [filters, setFilters] = useState({ subject: 'All', difficulty: 'All', type: 'All' });
  const [activeTab, setActiveTab] = useState('practice'); // practice, attempted, incorrect, bookmarked

  const dummyQuestions = [
    { id: 1, subject: 'Physics', chapter: 'Kinematics', text: 'A car accelerates from rest at 2 m/s². What is its velocity after 5 seconds?', difficulty: 'Medium', isPyq: true, year: '2021', attempts: 2, correct: false },
    { id: 2, subject: 'Chemistry', chapter: 'Thermodynamics', text: 'Calculate the enthalpy change when 1 mole of ice melts at 0°C.', difficulty: 'Hard', isPyq: false, attempts: 1, correct: true },
    { id: 3, subject: 'Mathematics', chapter: 'Calculus', text: 'Evaluate the integral of x² dx from 0 to 2.', difficulty: 'Easy', isPyq: true, year: '2023', attempts: 0, correct: null },
  ];

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
          {dummyQuestions.map(q => (
            <div key={q.id} style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 8px', background: '#f1f5f9', color: '#475569', borderRadius: '6px' }}>{q.subject}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 8px', background: '#f1f5f9', color: '#475569', borderRadius: '6px' }}>{q.chapter}</span>
                  {q.isPyq && <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 8px', background: '#fef2f2', color: '#ef4444', borderRadius: '6px' }}>PYQ {q.year}</span>}
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 8px', background: q.difficulty === 'Hard' ? '#fef2f2' : q.difficulty === 'Medium' ? '#fffbeb' : '#f0fdf4', color: q.difficulty === 'Hard' ? '#ef4444' : q.difficulty === 'Medium' ? '#f59e0b' : '#10b981', borderRadius: '6px' }}>{q.difficulty}</span>
                </div>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#cbd5e1' }}>🔖</button>
              </div>
              
              <h3 style={{ fontSize: '1.1rem', color: '#1e293b', margin: '0 0 24px 0', lineHeight: 1.5 }}>
                {q.text}
              </h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {q.attempts > 0 ? (q.correct ? '✅ Solved correctly' : '❌ Answered incorrectly') : 'Unattempted'}
                </span>
                <button style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                  Solve Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionBank;
