import React, { useState } from 'react';

const DoubtRoom = () => {
  const [activeTab, setActiveTab] = useState('pending'); // pending, answered, resolved
  
  const dummyDoubts = [
    { id: 1, title: 'Not understanding Lenz Law', subject: 'Physics', text: 'Why is the induced current opposing the change in magnetic flux? Can someone explain the conservation of energy here?', status: 'pending', date: '2023-10-14' },
    { id: 2, title: 'Organic Chem Mechanism', subject: 'Chemistry', text: 'What is the intermediate formed in SN1 reaction?', status: 'answered', answer: 'A carbocation intermediate is formed in SN1 reactions, leading to racemization.', answeredBy: 'Dr. Smith', date: '2023-10-12' },
    { id: 3, title: 'Integration limits', subject: 'Maths', text: 'How do we change limits when using substitution method?', status: 'resolved', answer: 'Plug the original x limits into your u=g(x) substitution equation to get the new u limits.', answeredBy: 'Prof. Davis', date: '2023-10-05' }
  ];

  const filteredDoubts = dummyDoubts.filter(d => d.status === activeTab);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#1e293b', margin: '0 0 8px 0', fontWeight: 800 }}>Doubt Room</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Ask questions and get answers from our expert faculty.</p>
        </div>
        <button style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>
          + Ask a Doubt
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
        {['pending', 'answered', 'resolved'].map(tab => (
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredDoubts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '3rem' }}>🔍</span>
            <h3 style={{ color: '#1e293b', marginTop: '16px' }}>No {activeTab} doubts</h3>
            <p style={{ color: '#64748b' }}>You don't have any {activeTab} doubts at the moment.</p>
          </div>
        ) : (
          filteredDoubts.map(d => (
            <div key={d.id} style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 8px', background: '#f1f5f9', color: '#475569', borderRadius: '6px' }}>{d.subject}</span>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Asked on {new Date(d.date).toLocaleDateString()}</span>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 8px', background: d.status === 'pending' ? '#fffbeb' : d.status === 'answered' ? '#e0f2fe' : '#f0fdf4', color: d.status === 'pending' ? '#f59e0b' : d.status === 'answered' ? '#0369a1' : '#15803d', borderRadius: '6px', textTransform: 'uppercase' }}>
                  {d.status}
                </span>
              </div>
              
              <h3 style={{ fontSize: '1.1rem', color: '#1e293b', margin: '0 0 12px 0', fontWeight: 700 }}>{d.title}</h3>
              <p style={{ margin: '0 0 24px 0', color: '#475569', lineHeight: 1.6 }}>{d.text}</p>

              {(d.status === 'answered' || d.status === 'resolved') && (
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#cbd5e1' }}></div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{d.answeredBy}</span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Faculty</span>
                  </div>
                  <p style={{ margin: 0, color: '#334155', lineHeight: 1.6 }}>{d.answer}</p>
                </div>
              )}

              {d.status === 'answered' && (
                <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                  <button style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Mark as Resolved</button>
                  <button style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Ask Follow-up</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoubtRoom;
