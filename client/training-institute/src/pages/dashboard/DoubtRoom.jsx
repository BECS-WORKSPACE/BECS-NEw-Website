import React, { useState, useEffect } from 'react';
import api from '../../api';

const DoubtRoom = () => {
  const [activeTab, setActiveTab] = useState('ask'); // ask, pending, resolved
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDoubts();
  }, []);

  const fetchDoubts = async () => {
    try {
      const res = await api.get('/doubts');
      if (res.data.success) {
        setDoubts(res.data.doubts);
      }
    } catch (err) {
      console.error("Error fetching doubts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAskDoubt = async (e) => {
    e.preventDefault();
    if (!subject || !title || !text) return;
    
    setIsSubmitting(true);
    try {
      const res = await api.post('/doubts', {
        subject, title, text
      });
      
      if (res.data.success) {
        setSubject('');
        setTitle('');
        setText('');
        setActiveTab('pending');
        fetchDoubts(); // Refresh list
      }
    } catch (err) {
      console.error("Error submitting doubt:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingDoubts = doubts.filter(d => d.status === 'pending');
  const resolvedDoubts = doubts.filter(d => d.status === 'answered' || d.status === 'resolved');
  
  let filteredDoubts = doubts;
  if (activeTab === 'pending') filteredDoubts = pendingDoubts;
  if (activeTab === 'resolved') filteredDoubts = resolvedDoubts;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#1e293b', margin: '0 0 8px 0', fontWeight: 800 }}>Doubt Room</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Get your concepts cleared by expert faculty within 24 hours.</p>
        </div>
        <button onClick={() => setActiveTab('ask')} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>
          Ask a Doubt
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
        {[
          { id: 'ask', label: 'Ask a Doubt' },
          { id: 'pending', label: `Pending (${pendingDoubts.length})` },
          { id: 'resolved', label: `Resolved (${resolvedDoubts.length})` }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ 
              padding: '10px 20px', 
              background: activeTab === tab.id ? '#eff6ff' : 'transparent', 
              color: activeTab === tab.id ? '#2563eb' : '#64748b',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {activeTab === 'ask' ? (
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '24px', fontWeight: 700 }}>Submit a New Doubt</h3>
            <form onSubmit={handleAskDoubt} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Subject</label>
                <select value={subject} onChange={e => setSubject(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} required>
                  <option value="">Select Subject...</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Biology">Biology</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Question Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Help with Thermodynamics Law 2" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Detailed Description</label>
                <textarea value={text} onChange={e => setText(e.target.value)} rows="6" placeholder="Explain what exactly you don't understand..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} required></textarea>
              </div>
              <button type="submit" disabled={isSubmitting} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? 'Submitting...' : 'Submit Doubt for Review'}
              </button>
            </form>
          </div>
        ) : filteredDoubts.length === 0 ? (
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
