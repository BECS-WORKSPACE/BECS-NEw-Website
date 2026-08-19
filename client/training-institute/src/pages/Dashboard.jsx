import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from '../components/dashboard/NotificationDropdown';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) navigate('/login');
    window.scrollTo(0, 0);
  }, [user, navigate]);

  if (!user) return null;

  const avatarSeed = encodeURIComponent(user.name || 'User');
  const userRole = user.role?.name || user.role || user.legacyRole || (user.isAdmin ? 'admin' : 'student');
  const avatarUrl = userRole === 'teacher' || userRole === 'Teacher'
    ? `https://api.dicebear.com/9.x/micah/svg?seed=${avatarSeed}&backgroundColor=f8fafc`
    : `https://api.dicebear.com/9.x/notionists/svg?seed=${avatarSeed}&backgroundColor=f8fafc`;

  const sidebarItems = (userRole === 'teacher' || userRole === 'Teacher') ? [
    { id: 'home', label: 'Overview', icon: '📊', path: '/dashboard' },
    { id: 'curriculum', label: 'Curriculum Builder', icon: '🏗️', path: '/dashboard/curriculum-builder' },
    { id: 'video_analytics', label: 'Video Analytics', icon: '📈', path: '/dashboard/video-analytics' },
    { id: 'students', label: 'Students', icon: '👥', path: '/dashboard/students' },
    { id: 'live', label: 'Live Classes', icon: '🔴', path: '/dashboard/live-classes' },
    { id: 'materials', label: 'Study Materials', icon: '☁️', path: '/dashboard/library' },
    { id: 'assignments', label: 'Assignments', icon: '📝', path: '/dashboard/assignments' },
    { id: 'tests', label: 'Mock Tests', icon: '🎯', path: '/dashboard/tests' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/profile' },
  ] : (userRole === 'admin' || userRole === 'Admin') ? [
    { id: 'home', label: 'Admin Dashboard', icon: '📈', path: '/dashboard' },
    { id: 'curriculum', label: 'Curriculum Builder', icon: '🏗️', path: '/dashboard/curriculum-builder' },
    { id: 'video_analytics', label: 'Video Analytics', icon: '📈', path: '/dashboard/video-analytics' },
    { id: 'users', label: 'User Management', icon: '👥', path: '/admin/users' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/profile' }
  ] : [
    { id: 'home', label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'my_courses', label: 'My Courses', icon: '📚', path: '/dashboard/courses' },
    { id: 'live', label: 'Live Classes', icon: '🔴', path: '/dashboard/live-classes' },
    { id: 'assignments', label: 'Assignments', icon: '📝', path: '/dashboard/assignments' },
    { id: 'tests', label: 'Mock Tests', icon: '🎯', path: '/dashboard/tests' },
    { id: 'materials', label: 'Study Materials', icon: '☁️', path: '/dashboard/library' },
    { id: 'downloads', label: 'Downloads', icon: '⬇️', path: '/dashboard/downloads' },
    { id: 'certificates', label: 'Certificates', icon: '🎓', path: '/dashboard/certificates' },
    { id: 'wishlist', label: 'Wishlist', icon: '❤️', path: '/dashboard/wishlist' },
    { id: 'bookmarks', label: 'Bookmarks', icon: '🔖', path: '/dashboard/bookmarks' },
    { id: 'achievements', label: 'Achievements', icon: '🏆', path: '/dashboard/achievements' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🥇', path: '/dashboard/leaderboard' },
    { id: 'notifications', label: 'Notifications', icon: '🔔', path: '/dashboard/notifications' },
    { id: 'calendar', label: 'Calendar', icon: '📅', path: '/dashboard/calendar' },
    { id: 'profile', label: 'Profile', icon: '👤', path: '/profile' },
    ...(user.enrolledCourses?.length > 0 ? [{ id: 'subscription', label: 'Subscription', icon: '💳', path: '/dashboard/subscription' }] : []),
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/dashboard/settings' },
    { id: 'support', label: 'Support', icon: '🎧', path: '/dashboard/support' }
  ];

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      <style>
        {`
          .animate-fade-in { animation: fadeIn 0.3s ease-out; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          
          .dashboard-layout { display: flex; flex: 1; overflow: hidden; position: relative; }
          
          .dashboard-sidebar {
            width: 260px; 
            background: #ffffff; 
            border-right: 1px solid #e2e8f0;
            display: flex; 
            flex-direction: column; 
            padding: 24px 16px; 
            transition: transform 0.3s ease;
            z-index: 50;
            flex-shrink: 0;
            overflow-y: auto;
          }
          
          .sidebar-btn {
            display: flex; 
            align-items: center; 
            gap: 14px; 
            width: 100%; 
            padding: 14px 16px; 
            margin-bottom: 4px; 
            border-radius: 12px; 
            border: none; 
            font-size: 0.95rem;
            cursor: pointer; 
            text-align: left; 
            transition: all 0.2s;
            white-space: nowrap;
          }
          
          .sidebar-btn:hover:not(.active) {
            background: #f1f5f9;
          }
          
          .sidebar-btn.active {
            background: rgba(37, 99, 235, 0.1); /* Primary Blue for Active state */
            color: #2563eb;
            font-weight: 700;
          }
          .sidebar-btn:not(.active) {
            background: transparent;
            color: #475569;
            font-weight: 600;
          }

          .dashboard-main { 
            flex: 1; 
            padding: 40px; 
            overflow-y: auto; 
            background: #f8fafc; 
          }
          
          .mobile-nav-toggle { 
            display: none; 
            background: #ffffff; 
            padding: 16px 24px; 
            border-bottom: 1px solid #e2e8f0; 
            align-items: center; 
            justify-content: space-between; 
          }
          
          @media (max-width: 900px) {
            .dashboard-sidebar {
              position: absolute; top: 0; left: 0; bottom: 0;
              transform: translateX(-100%);
              box-shadow: 10px 0 30px rgba(0,0,0,0.1);
              height: 100%;
            }
            .dashboard-sidebar.open { transform: translateX(0); }
            .dashboard-main { padding: 24px 16px; }
            .mobile-nav-toggle { display: flex; }
          }
        `}
      </style>

      {/* Mobile Header Toggle */}
      <div className="mobile-nav-toggle">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={avatarUrl} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9' }} />
          <span style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '1.1rem' }}>EduVerse Portal</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'transparent', border: 'none', fontSize: '1.8rem', cursor: 'pointer', color: 'var(--navy)' }}>
          ☰
        </button>
      </div>

      <div className="dashboard-layout">
        {/* Sidebar Overlay for Mobile */}
        {isSidebarOpen && (
          <div onClick={() => setIsSidebarOpen(false)} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40, '@media (minWidth: 901px)': { display: 'none' } }} />
        )}

        {/* Sidebar */}
        <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          {/* Profile Section in Sidebar */}
          <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px', padding: '0 8px' }}>
            <img src={avatarUrl} alt="Avatar" style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f1f5f9', border: '2px solid #e2e8f0' }} />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 800, color: 'var(--navy)', fontSize: '1.15rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.name}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {user.role === 'teacher' ? 'Faculty Portal' : 'Student Portal'}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {sidebarItems.map(item => (
              <button 
                key={item.id}
                onClick={() => { navigate(item.path); setIsSidebarOpen(false); }}
                className={`sidebar-btn ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area via React Router Outlet */}
        <main className="dashboard-main" style={{ display: 'flex', flexDirection: 'column' }}>
          
          {/* Top Global Header */}
          <header style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            paddingBottom: '24px', marginBottom: '32px', borderBottom: '1px solid #e2e8f0',
            '@media (max-width: 900px)': { display: 'none' } // Hidden on mobile, they use the toggle header
          }}>
            <div style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
              <input 
                type="text" 
                placeholder="Search courses, lessons, materials..." 
                style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '24px', border: '1px solid #e2e8f0', background: '#ffffff', outline: 'none', fontSize: '0.95rem' }} 
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              {/* Quick Action */}
              <button onClick={() => navigate('/dashboard/live-classes')} style={{ background: '#fef2f2', color: '#ef4444', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>🔴</span> Live Now
              </button>
              
              {/* Notification Dropdown Component */}
              <NotificationDropdown />

              {/* Profile Avatar Trigger */}
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', cursor: 'pointer', border: '2px solid #e2e8f0' }} onClick={() => navigate('/profile')}>
                <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </header>

          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
