import React from 'react';

const MistakeBook = () => {
  const mistakes = [
    { 
      id: 1, 
      subject: 'Physics', 
      topic: 'Projectile Motion',
      question: 'A projectile is fired at an angle of 45°. What is the ratio of its maximum height to its horizontal range?',
      studentAnswer: '1:2',
      correctAnswer: '1:4',
      explanation: 'H = (u² sin²θ)/2g, R = (u² sin 2θ)/g. At θ = 45°, sin 45° = 1/√2, sin 90° = 1. H/R = (u²/4g) / (u²/g) = 1/4.',
      date: '2023-10-12',
      attempts: 2
    },
    { 
      id: 2, 
      subject: 'Chemistry', 
      topic: 'Chemical Bonding',
      question: 'Which of the following has a zero dipole moment?',
      studentAnswer: 'NH3',
      correctAnswer: 'BF3',
      explanation: 'BF3 has a trigonal planar geometry which makes it symmetrical, cancelling out the individual bond dipoles. NH3 has a lone pair making it asymmetrical.',
      date: '2023-10-10',
      attempts: 1
    }
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', color: '#1e293b', margin: '0 0 8px 0', fontWeight: 800 }}>Mistake Book</h1>
        <p style={{ color: '#64748b', margin: 0 }}>Review the questions you answered incorrectly to identify weak areas.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {mistakes.map(m => (
          <div key={m.id} style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            
            <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 8px', background: '#e0f2fe', color: '#0369a1', borderRadius: '6px' }}>{m.subject}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 8px', background: '#f1f5f9', color: '#475569', borderRadius: '6px' }}>{m.topic}</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Added on {new Date(m.date).toLocaleDateString()}</span>
            </div>
            
            <div style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#1e293b', margin: '0 0 24px 0', lineHeight: 1.5 }}>
                {m.question}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div style={{ background: '#fef2f2', padding: '16px', borderRadius: '12px', border: '1px solid #fca5a5' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#b91c1c', fontWeight: 700, textTransform: 'uppercase' }}>Your Answer</p>
                  <p style={{ margin: 0, fontSize: '1.05rem', color: '#7f1d1d' }}>{m.studentAnswer}</p>
                </div>
                <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '12px', border: '1px solid #86efac' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#15803d', fontWeight: 700, textTransform: 'uppercase' }}>Correct Answer</p>
                  <p style={{ margin: 0, fontSize: '1.05rem', color: '#14532d' }}>{m.correctAnswer}</p>
                </div>
              </div>

              <div style={{ background: '#f1f5f9', padding: '20px', borderRadius: '12px' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#475569', fontWeight: 700 }}>Explanation</p>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#334155', lineHeight: 1.6 }}>{m.explanation}</p>
              </div>
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Attempts: {m.attempts}</span>
              <button style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                Re-attempt Question
              </button>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default MistakeBook;
