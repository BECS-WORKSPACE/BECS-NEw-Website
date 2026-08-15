import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MockTests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Premium gate
  if (!user?.isPremium) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔒</div>
        <h2 style={{ fontSize: '2rem', color: 'var(--navy)', fontFamily: 'Outfit', fontWeight: 700, marginBottom: '12px' }}>Premium Feature Locked</h2>
        <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '400px', marginBottom: '24px' }}>Subscribe to EduVerse Premium to unlock full-length mock tests, detailed analysis reports, and real-time percentiles.</p>
        <button onClick={() => navigate('/dashboard/subscription')} style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #2563eb, #1e40af)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>
          Upgrade to Premium
        </button>
      </div>
    );
  }

  const tests = [
    {
      id: 1,
      title: 'Full Length JEE Advanced Mock',
      subject: 'Engineering Entrance',
      questions: 54,
      duration: '3 Hours',
      score: '185/300',
      status: 'Completed',
      percentile: '92nd'
    },
    {
      id: 2,
      title: 'Thermodynamics Topic Test',
      subject: 'Physics',
      questions: 30,
      duration: '1 Hour',
      score: null,
      status: 'Pending',
      percentile: null
    },
    {
      id: 3,
      title: 'Calculus Advanced Assessment',
      subject: 'Mathematics',
      questions: 45,
      duration: '2 Hours',
      score: null,
      status: 'Pending',
      percentile: null
    }
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontFamily: 'Outfit', color: 'var(--navy)', marginBottom: '8px', fontWeight: 700 }}>Mock Tests & Assessments</h2>
          <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>Evaluate your knowledge and track your percentile.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ padding: '10px 20px', borderRadius: '12px', background: 'var(--primary)', fontWeight: 600, color: 'white', border: 'none', cursor: 'pointer' }}>
            + Create Custom Test
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {tests.map((test) => (
          <div key={test.id} style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={{ padding: '6px 12px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
                  {test.subject}
                </span>
                {test.status === 'Completed' && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.85rem', fontWeight: 700 }}>
                    ✓ Completed
                  </span>
                )}
              </div>
              
              <h3 style={{ fontSize: '1.3rem', color: 'var(--navy)', marginBottom: '16px', fontWeight: 700, lineHeight: 1.4 }}>{test.title}</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', color: '#64748b', fontSize: '0.95rem' }}>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8' }}>Questions</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--navy)', marginTop: '4px' }}>{test.questions} Qs</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8' }}>Duration</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--navy)', marginTop: '4px' }}>{test.duration}</div>
                </div>
              </div>

              {test.status === 'Completed' && (
                <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(59,130,246,0.05)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Score</span>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#2563eb' }}>{test.score}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Percentile</span>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#2563eb' }}>{test.percentile}</div>
                  </div>
                </div>
              )}
            </div>
            
            <div style={{ padding: '20px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
              <button 
                style={{ 
                  width: '100%', padding: '14px', borderRadius: '12px', 
                  background: test.status === 'Completed' ? 'white' : 'var(--primary)', 
                  color: test.status === 'Completed' ? 'var(--navy)' : 'white', 
                  border: test.status === 'Completed' ? '1px solid #cbd5e1' : 'none', 
                  fontWeight: 600, cursor: 'pointer',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
                }}
              >
                {test.status === 'Completed' ? 'View Analysis Report' : 'Start Test Now'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MockTests;
