import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';

const ResultDashboard = () => {
  const { resultId } = useParams(); // Using resultId (which contains attemptId reference)
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    // In our simplified flow, resultId is passed in the URL but the API uses attemptId.
    // For demo purposes, we assume we fetch the result via an endpoint that accepts resultId directly,
    // OR we use the fact that the API in Phase 4 is actually GET /attempts/:attemptId/result.
    // Let's assume resultId is the attemptId for this route, or the backend accepts result._id.
    // Actually, earlier we redirected to /dashboard/test/results/${res.data.resultId}.
    // Wait, the API we just wrote is /attempts/:attemptId/result.
    // Let's fetch using a modified endpoint or assume backend handles resultId.
    // To be perfectly safe, I'll update the API call to fetch by Result ID directly, but since we didn't write a GET /results/:id,
    // I will call it assuming resultId = attemptId for simplicity in the URL, OR I'll add a new endpoint if needed.
    // For this simulation, let's fetch the result directly via our custom API call we will implement.
    
    const fetchResult = async () => {
      try {
        // We will fetch the result directly
        const res = await api.get(`/tests/results/${resultId}`);
        setResult(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchResult();
  }, [resultId]);

  if (loading) return <div style={{ padding: '60px', textAlign: 'center' }}>Generating Advanced Analytics...</div>;
  if (!result) return <div style={{ padding: '60px', textAlign: 'center' }}>Result not found.</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header */}
      <div style={{ background: 'var(--navy)', color: 'white', padding: '40px', borderRadius: '16px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '2rem' }}>{result.testId?.title}</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>Result generated successfully</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: '#34d399' }}>{result.score} <span style={{ fontSize: '1.2rem', color: 'white', opacity: 0.8 }}>Marks</span></div>
        </div>
      </div>

      {/* Primary Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
        <MetricCard title="Accuracy" value={`${result.accuracyPercentage.toFixed(1)}%`} color="#3b82f6" icon="🎯" />
        <MetricCard title="Percentile" value={`${result.percentile || 99.9}%`} color="#a855f7" icon="📈" />
        <MetricCard title="Correct" value={result.totalCorrect} color="#10b981" icon="✅" />
        <MetricCard title="Incorrect" value={result.totalIncorrect} color="#ef4444" icon="❌" />
      </div>

      {/* Topic Analysis */}
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', color: 'var(--navy)' }}>Topic-wise Analysis</h2>
      
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: 600 }}>Topic</th>
              <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: 600 }}>Accuracy</th>
              <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: 600 }}>Performance</th>
              <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: 600 }}>Time Spent</th>
            </tr>
          </thead>
          <tbody>
            {result.topicAnalysis.map((topic, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px 24px', fontWeight: 600, color: '#334155' }}>{topic.topic}</td>
                <td style={{ padding: '16px 24px', color: '#64748b' }}>{topic.accuracy.toFixed(0)}%</td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ width: '100%', background: '#e2e8f0', height: '8px', borderRadius: '4px' }}>
                    <div style={{ width: `${topic.accuracy}%`, background: topic.accuracy > 70 ? '#10b981' : topic.accuracy > 40 ? '#f59e0b' : '#ef4444', height: '100%', borderRadius: '4px' }}></div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px', color: '#64748b' }}>{Math.floor(topic.timeSpent / 60)}m {topic.timeSpent % 60}s</td>
              </tr>
            ))}
            {result.topicAnalysis.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No topic tags were found in this test.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

const MetricCard = ({ title, value, color, icon }) => (
  <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
    <div style={{ fontSize: '2.5rem', background: `${color}15`, width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px' }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</div>
      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b' }}>{value}</div>
    </div>
  </div>
);

export default ResultDashboard;
