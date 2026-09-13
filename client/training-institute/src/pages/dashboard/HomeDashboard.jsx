import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TeacherHome from './TeacherHome';
import AdminHome from './AdminHome';

const HomeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const userRole = user?.role?.name || user?.role || user?.legacyRole || (user?.isAdmin ? 'admin' : 'student');
  
  if (userRole === 'admin' || userRole === 'Admin') {
    return <AdminHome />;
  }
  
  if (userRole === 'teacher' || userRole === 'Teacher') {
    return <TeacherHome />;
  }

  // Dummy Analytics Data based on Part 5 Requirements
  const streak = user?.streak || 12;
  const examReadiness = 78; // Calculated score out of 100
  const syllabusCompletion = 65;
  const questionsSolved = 1245;
  const testsCompleted = 18;
  const averageScore = 82;
  const attendance = 94;
  
  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      
      {/* 1. Welcome Banner & Streak (Top Row) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px', '@media (max-width: 900px)': { gridTemplateColumns: '1fr' } }}>
        
        {/* Welcome Card */}
        <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '24px', padding: '32px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(15,23,42,0.15)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', top: '-100px', right: '-50px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '2.2rem', fontFamily: 'Outfit', fontWeight: 800, margin: '0 0 8px 0' }}>
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.1rem', margin: '0 0 24px 0', maxWidth: '80%' }}>
              Today's Learning: You have a live class at 4:00 PM and a Chapter Test pending.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={() => navigate('/dashboard/learning-path')} style={{ padding: '12px 24px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>
                Continue Learning
              </button>
            </div>
          </div>
        </div>

        {/* Gamification / Streak Widget */}
        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem', fontWeight: 600, textTransform: 'uppercase' }}>Study Streak</p>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '2.2rem', color: 'var(--navy)', fontWeight: 800 }}>{streak} <span style={{ fontSize: '1.4rem', color: '#f59e0b' }}>Days 🔥</span></h3>
            </div>
            <div style={{ width: '64px', height: '64px', background: 'rgba(245,158,11,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
              🎯
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {[
          { label: 'Exam Readiness', value: `${examReadiness}/100`, icon: '📈', color: '#10b981' },
          { label: 'Syllabus Completion', value: `${syllabusCompletion}%`, icon: '📚', color: '#3b82f6' },
          { label: 'Questions Solved', value: questionsSolved, icon: '🗃️', color: '#8b5cf6' },
          { label: 'Tests Completed', value: testsCompleted, icon: '🎯', color: '#f59e0b' },
          { label: 'Average Score', value: `${averageScore}%`, icon: '🏆', color: '#ef4444' },
          { label: 'Live Attendance', value: `${attendance}%`, icon: '🔴', color: '#06b6d4' }
        ].map(stat => (
          <div key={stat.label} style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{stat.label}</p>
              <h4 style={{ margin: '4px 0 0 0', fontSize: '1.25rem', color: '#1e293b', fontWeight: 800 }}>{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Continue Learning & Upcoming Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Continue Learning */}
        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--navy)', margin: '0 0 24px 0', fontWeight: 700 }}>Continue Learning</h3>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ width: '120px', height: '80px', background: '#e2e8f0', borderRadius: '12px', flexShrink: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1635070041078-e363dbe005cb)', backgroundSize: 'cover' }}></div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Physics • Chapter 4</span>
              <h4 style={{ margin: '8px 0', fontSize: '1.1rem', color: '#1e293b', fontWeight: 700 }}>Laws of Motion: Friction</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ flex: 1, height: '6px', background: '#cbd5e1', borderRadius: '3px' }}>
                  <div style={{ width: '45%', height: '100%', background: '#3b82f6', borderRadius: '3px' }}></div>
                </div>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>45%</span>
              </div>
            </div>
            <button onClick={() => navigate('/dashboard/learning-path')} style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 4px 12px rgba(59,130,246,0.4)' }}>
              ▶
            </button>
          </div>
        </div>

        {/* Schedule */}
        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--navy)', margin: '0 0 24px 0', fontWeight: 700 }}>Upcoming</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Live Class */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>🔴</div>
              <div>
                <h5 style={{ margin: 0, fontSize: '1rem', color: '#1e293b', fontWeight: 600 }}>Physics Mechanics Live</h5>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>Today, 4:00 PM</p>
              </div>
            </div>
            
            {/* Mock Test */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>🎯</div>
              <div>
                <h5 style={{ margin: 0, fontSize: '1rem', color: '#1e293b', fontWeight: 600 }}>Weekly Full Mock Test</h5>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>Sunday, 10:00 AM</p>
              </div>
            </div>
            
            {/* Mentorship */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f0fdf4', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>🤝</div>
              <div>
                <h5 style={{ margin: 0, fontSize: '1rem', color: '#1e293b', fontWeight: 600 }}>Mentor Check-in</h5>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>Friday, 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomeDashboard;
