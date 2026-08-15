import React from 'react';
import { useAuth } from '../../context/AuthContext';

const LearningAnalytics = () => {
  const { user } = useAuth();
  
  // Dummy analytics data for UI preview
  const stats = {
    totalCourses: user?.enrolledCourses?.length || 4,
    completedCourses: 1,
    hoursStudied: 124,
    currentStreak: user?.streak || 12,
    xpEarned: user?.xp || 4250,
    rank: 142
  };

  const badges = [
    { id: 1, icon: '🔥', name: '7-Day Streak', desc: 'Studied for 7 consecutive days' },
    { id: 2, icon: '📚', name: 'Bookworm', desc: 'Completed 5 modules' },
    { id: 3, icon: '🎯', name: 'Sharpshooter', desc: 'Scored 100% in a Mock Test' },
    { id: 4, icon: '🌟', name: 'Early Bird', desc: 'Attended a 6 AM Live Class' }
  ];

  const weeklyProgress = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3 },
    { day: 'Wed', hours: 1.5 },
    { day: 'Thu', hours: 4 },
    { day: 'Fri', hours: 2 },
    { day: 'Sat', hours: 0 },
    { day: 'Sun', hours: 1 }
  ];
  const maxHours = Math.max(...weeklyProgress.map(d => d.hours));

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2.2rem', fontFamily: 'Outfit', color: 'var(--navy)', margin: '0 0 8px 0', fontWeight: 800 }}>Learning Analytics</h2>
        <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 0 }}>Track your performance, earn badges, and climb the leaderboard.</p>
      </div>

      {/* Top Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {[
          { label: 'Total Enrolled', value: stats.totalCourses, icon: '📚', color: '#3b82f6', bg: '#eff6ff' },
          { label: 'Completed', value: stats.completedCourses, icon: '🏆', color: '#10b981', bg: '#ecfdf5' },
          { label: 'Hours Studied', value: stats.hoursStudied, icon: '⏱️', color: '#8b5cf6', bg: '#f5f3ff' },
          { label: 'Global Rank', value: `#${stats.rank}`, icon: '🌍', color: '#f59e0b', bg: '#fffbeb' }
        ].map((stat, i) => (
          <div key={i} style={{ background: '#ffffff', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>
              {stat.icon}
            </div>
            <div>
              <h3 style={{ fontSize: '2rem', color: 'var(--navy)', margin: '0 0 4px 0', fontWeight: 800 }}>{stat.value}</h3>
              <p style={{ color: '#64748b', margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', '@media (max-width: 900px)': { gridTemplateColumns: '1fr' } }}>
        
        {/* Weekly Progress Chart */}
        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--navy)', margin: '0 0 32px 0', fontWeight: 700 }}>Weekly Learning Time</h3>
          
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '250px', paddingBottom: '20px' }}>
            {weeklyProgress.map((day, i) => {
              const heightPct = (day.hours / maxHours) * 100;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                    {day.hours > 0 && (
                      <div style={{ 
                        width: '40px', height: `${heightPct}%`, 
                        background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)', 
                        borderRadius: '8px 8px 0 0',
                        position: 'relative',
                        transition: 'height 1s ease-out'
                      }}>
                        <div style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', background: '#1e293b', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                          {day.hours}h
                        </div>
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>{day.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gamification & Badges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', borderRadius: '24px', padding: '32px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(245,158,11,0.2)' }}>
            <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', fontSize: '10rem', opacity: 0.2 }}>🏆</div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9 }}>Total XP Earned</p>
              <h3 style={{ fontSize: '3rem', margin: '0 0 16px 0', fontWeight: 800 }}>{stats.xpEarned}</h3>
              <p style={{ margin: 0, fontWeight: 600 }}>Level {Math.floor(stats.xpEarned / 1000) + 1}</p>
            </div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--navy)', margin: 0, fontWeight: 700 }}>My Badges</h3>
              <span style={{ background: '#f8fafc', color: '#64748b', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>{badges.length} Unlocked</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {badges.map(badge => (
                <div key={badge.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{badge.icon}</div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: 'var(--navy)', fontWeight: 700 }}>{badge.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LearningAnalytics;
