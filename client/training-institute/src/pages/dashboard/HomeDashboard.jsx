import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HomeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Dummy Analytics Data
  const streak = user?.streak || 12;
  const xp = user?.xp || 4250;
  const level = Math.floor(xp / 1000) + 1;
  const dailyGoalProgress = 65; // Percentage

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      
      {/* 1. Welcome Banner & Streak (Top Row) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px', '@media (max-width: 900px)': { gridTemplateColumns: '1fr' } }}>
        
        {/* Welcome Card */}
        <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '24px', padding: '32px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(15,23,42,0.15)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', top: '-100px', right: '-50px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '2.2rem', fontFamily: 'Outfit', fontWeight: 800, margin: '0 0 8px 0' }}>
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.1rem', margin: '0 0 24px 0', maxWidth: '80%' }}>
              Ready to crush your learning goals today? You have 2 assignments pending and a live class at 4:00 PM.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={() => navigate('/dashboard/courses')} style={{ padding: '12px 24px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>
                Resume Learning
              </button>
              {!user?.isPremium && user?.enrolledCourses?.length > 0 && (
                <button onClick={() => navigate('/dashboard/subscription')} style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
                  Upgrade to Premium
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Gamification / Streak Widget */}
        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Learning Streak</p>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '2rem', color: 'var(--navy)', fontWeight: 800 }}>{streak} <span style={{ fontSize: '1.2rem', color: '#f59e0b' }}>Days 🔥</span></h3>
            </div>
            <div style={{ width: '60px', height: '60px', background: 'rgba(245,158,11,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>
              🎯
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>Level {level}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#3b82f6' }}>{xp} XP</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px' }}>
              <div style={{ width: `${(xp % 1000) / 10}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #60a5fa)', borderRadius: '4px' }}></div>
            </div>
            <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', color: '#64748b', textAlign: 'right' }}>{1000 - (xp % 1000)} XP to Level {level + 1}</p>
          </div>
        </div>
      </div>

      {/* 2. Middle Row: Daily Goal & Continue Learning */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '32px' }}>
        
        {/* Daily Goal */}
        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--navy)', margin: '0 0 20px 0', fontWeight: 700 }}>Daily Goal</h3>
          
          <div style={{ position: 'relative', width: '140px', height: '140px', margin: '0 auto 20px auto' }}>
            <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" strokeDasharray="100, 100" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray={`${dailyGoalProgress}, 100`} strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)' }}>{dailyGoalProgress}%</span>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Completed</span>
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '0 0 4px 0', color: 'var(--navy)', fontWeight: 600 }}>45 / 60 Mins</p>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>You're almost there!</p>
          </div>
        </div>

        {/* Continue Learning Widget */}
        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--navy)', margin: 0, fontWeight: 700 }}>Continue Learning</h3>
            <button onClick={() => navigate('/dashboard/courses')} style={{ background: 'transparent', border: 'none', color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}>View All</button>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', padding: '20px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
             <div style={{ width: '140px', height: '90px', background: 'linear-gradient(135deg, #2563eb, #3b82f6)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
               ⚛️
             </div>
             <div style={{ flex: 1 }}>
               <h4 style={{ margin: '0 0 8px 0', color: 'var(--navy)', fontSize: '1.2rem', fontWeight: 700 }}>Advanced React Patterns</h4>
               <p style={{ margin: '0 0 12px 0', color: '#64748b', fontSize: '0.95rem' }}>Module 4: Custom Hooks & Performance</p>
               <div style={{ width: '100%', background: '#e2e8f0', height: '8px', borderRadius: '4px' }}>
                  <div style={{ width: '75%', background: '#2563eb', height: '100%', borderRadius: '4px' }}></div>
               </div>
               <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>75% Completed</p>
             </div>
             <button style={{ background: '#2563eb', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
               Resume ▷
             </button>
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: Schedules & Announcements */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Today's Schedule */}
        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--navy)', margin: '0 0 20px 0', fontWeight: 700 }}>Today's Schedule</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ padding: '8px 12px', background: '#fef2f2', color: '#ef4444', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', minWidth: '80px', textAlign: 'center' }}>
                4:00 PM
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', color: 'var(--navy)', fontWeight: 700 }}>System Design Live Class</h4>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>with Mr. Sharma</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ padding: '8px 12px', background: '#fffbeb', color: '#f59e0b', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', minWidth: '80px', textAlign: 'center' }}>
                6:00 PM
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', color: 'var(--navy)', fontWeight: 700 }}>Mock Test: Node.js Basics</h4>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Duration: 60 mins</p>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Announcements */}
        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--navy)', margin: '0 0 20px 0', fontWeight: 700 }}>Latest Announcements</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'rgba(59,130,246,0.05)', borderLeft: '4px solid #2563eb', borderRadius: '0 12px 12px 0' }}>
              <h4 style={{ margin: '0 0 6px 0', color: '#1e40af', fontWeight: 700 }}>New Course Added! 🚀</h4>
              <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem', lineHeight: 1.4 }}>
                We've just dropped "Mastering Next.js 14". Premium members have instant access. Check it out in the catalog!
              </p>
            </div>
            
            <div style={{ padding: '16px', background: 'rgba(16,185,129,0.05)', borderLeft: '4px solid #10b981', borderRadius: '0 12px 12px 0' }}>
              <h4 style={{ margin: '0 0 6px 0', color: '#065f46', fontWeight: 700 }}>Maintenance Scheduled</h4>
              <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem', lineHeight: 1.4 }}>
                The platform will undergo brief maintenance on Sunday at 2:00 AM IST for 30 minutes.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default HomeDashboard;
