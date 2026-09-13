import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

const Performance = () => {
  const scoreData = [
    { name: 'Test 1', score: 65, accuracy: 70 },
    { name: 'Test 2', score: 72, accuracy: 75 },
    { name: 'Test 3', score: 68, accuracy: 72 },
    { name: 'Test 4', score: 85, accuracy: 82 },
    { name: 'Test 5', score: 82, accuracy: 80 },
    { name: 'Test 6', score: 90, accuracy: 88 },
  ];

  const subjectData = [
    { subject: 'Physics', score: 75, fullMark: 100 },
    { subject: 'Chemistry', score: 85, fullMark: 100 },
    { subject: 'Maths', score: 92, fullMark: 100 },
    { subject: 'Biology', score: 60, fullMark: 100 },
  ];

  const topicData = [
    { name: 'Mechanics', score: 80 },
    { name: 'Thermodynamics', score: 65 },
    { name: 'Calculus', score: 95 },
    { name: 'Optics', score: 70 },
    { name: 'Algebra', score: 85 },
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', color: '#1e293b', margin: '0 0 8px 0', fontWeight: 800 }}>Performance Analytics</h1>
        <p style={{ color: '#64748b', margin: 0 }}>Track your score trends, accuracy, and identify weak topics.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px', '@media (max-width: 900px)': { gridTemplateColumns: '1fr' } }}>
        
        {/* Score Trend */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '24px', fontWeight: 700 }}>Score & Accuracy Trend</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer>
              <LineChart data={scoreData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Radar */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '24px', fontWeight: 700 }}>Subject Competency</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={subjectData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar name="Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topic Performance Bar */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', gridColumn: '1 / -1' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '24px', fontWeight: 700 }}>Topic-wise Performance</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={topicData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Performance;
