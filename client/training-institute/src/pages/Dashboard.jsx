import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from '../components/dashboard/NotificationDropdown';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  
  const tItems = [
    { id: 'home', label: 'Overview', icon: '📊', path: '/dashboard' },
    { id: 'courses', label: 'My Courses', icon: '📚', path: '/dashboard/teacher/courses' },
    { id: 'batches', label: 'My Batches', icon: '🏫', path: '/dashboard/teacher/batches' },
    { id: 'students', label: 'Students', icon: '👥', path: '/dashboard/teacher/students' },
    { id: 'curriculum', label: 'Learning Content', icon: '🏗️', path: '/dashboard/curriculum-builder' },
    { id: 'live', label: 'Live Classes', icon: '🔴', path: '/dashboard/live-classes' },
    { id: 'recorded', label: 'Recorded Classes', icon: '📼', path: '/dashboard/teacher/recorded' },
    { id: 'materials', label: 'Study Materials', icon: '☁️', path: '/dashboard/teacher/materials' },
    { id: 'question_bank', label: 'Question Bank', icon: '🗃️', path: '/dashboard/teacher/question-bank' },
    { id: 'pyqs', label: 'PYQs', icon: '📜', path: '/dashboard/teacher/pyqs' },
    { id: 'tests', label: 'Mock Tests', icon: '🎯', path: '/dashboard/teacher/tests' },
    { id: 'assignments', label: 'Assignments', icon: '📝', path: '/dashboard/teacher/assignments' },
    { id: 'doubts', label: 'Doubt Room', icon: '💬', path: '/dashboard/teacher/doubts' },
    { id: 'attendance', label: 'Attendance', icon: '✅', path: '/dashboard/teacher/attendance' },
    { id: 'mentorship', label: 'Mentorship', icon: '🤝', path: '/dashboard/teacher/mentorship' },
    { id: 'performance', label: 'Performance', icon: '📈', path: '/dashboard/teacher/performance' },
    { id: 'announcements', label: 'Announcements', icon: '📢', path: '/dashboard/teacher/announcements' },
    { id: 'calendar', label: 'Calendar', icon: '📅', path: '/dashboard/teacher/calendar' },
    { id: 'notifications', label: 'Notifications', icon: '🔔', path: '/dashboard/teacher/notifications' },
    { id: 'settings', label: 'Profile', icon: '⚙️', path: '/profile' },
  ];

  const aItems = [
    { id: 'home', label: 'Admin Dashboard', icon: '📈', path: '/dashboard' },
    { group: 'ACADEMIC' },
    { id: 'admin_courses', label: 'Courses & Pricing', icon: '📚', path: '/admin/courses' },
    { id: 'admin_content', label: 'Content Approval', icon: '✅', path: '/admin/content' },
    { id: 'admin_batches', label: 'Batches', icon: '🏫', path: '/admin/batches' },
    { group: 'PEOPLE' },
    { id: 'admin_students', label: 'Students', icon: '👨‍🎓', path: '/admin/students' },
    { id: 'admin_teachers', label: 'Teachers', icon: '👨‍🏫', path: '/admin/teachers' },
    { id: 'admin_users', label: 'All Users & Roles', icon: '👥', path: '/admin/users' },
    { group: 'FINANCE' },
    { id: 'admin_enrollments', label: 'Enrollments', icon: '📝', path: '/admin/enrollments' },
    { id: 'admin_subscriptions', label: 'Subscriptions', icon: '💳', path: '/admin/subscriptions' },
    { id: 'admin_payments', label: 'Payments', icon: '💰', path: '/admin/payments' },
    { id: 'admin_revenue', label: 'Revenue Analytics', icon: '📊', path: '/admin/revenue' },
    { group: 'ANALYTICS' },
    { id: 'admin_learning', label: 'Learning Analytics', icon: '🧠', path: '/admin/learning' },
    { id: 'admin_video', label: 'Video Analytics', icon: '📼', path: '/admin/video' },
    { group: 'CMS & SETTINGS' },
    { id: 'admin_scholarship', label: 'Scholarships', icon: '🎓', path: '/admin/scholarship' },
    { id: 'admin_cms', label: 'CMS Manager', icon: '🌐', path: '/admin/cms' },
    { id: 'admin_settings', label: 'Settings', icon: '⚙️', path: '/admin/settings' },
  ];

  const sItems = [
    { id: 'home', label: 'My Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'my_courses', label: 'My Courses', icon: '📚', path: '/dashboard/courses' },
    { id: 'learning_path', label: 'Learning Path', icon: '🛤️', path: '/dashboard/learning-path' },
    { id: 'live', label: 'Live Classes', icon: '🔴', path: '/dashboard/live-classes' },
    { id: 'recorded', label: 'Recorded Classes', icon: '📼', path: '/dashboard/recorded' },
    { id: 'materials', label: 'Study Materials', icon: '☁️', path: '/dashboard/library' },
    { id: 'question_bank', label: 'Question Bank', icon: '🗃️', path: '/dashboard/question-bank' },
    { id: 'mistake_book', label: 'Mistake Book', icon: '📓', path: '/dashboard/mistake-book' },
    { id: 'pyqs', label: 'PYQs', icon: '📜', path: '/dashboard/pyqs' },
    { id: 'tests', label: 'Mock Tests', icon: '🎯', path: '/dashboard/tests' },
    { id: 'assignments', label: 'Assignments', icon: '📝', path: '/dashboard/assignments' },
    { id: 'doubts', label: 'Doubt Room', icon: '💬', path: '/dashboard/doubts' },
    { id: 'mentorship', label: 'Mentorship', icon: '🤝', path: '/dashboard/mentorship' },
    { id: 'counselling', label: 'Counselling', icon: '🧠', path: '/counselling' },
    { id: 'scholarship', label: 'Scholarship', icon: '🎓', path: '/scholarship-test' },
    { id: 'performance', label: 'Performance', icon: '📈', path: '/dashboard/performance' },
    { id: 'achievements', label: 'Achievements', icon: '🏆', path: '/dashboard/achievements' },
    { id: 'certificates', label: 'Certificates', icon: '📜', path: '/dashboard/certificates' },
    { id: 'subscription', label: 'Payments', icon: '💳', path: '/subscription' },
    { id: 'profile', label: 'Profile', icon: '👤', path: '/profile' },
    { id: 'support', label: 'Support', icon: '🎧', path: '/dashboard/support' }
  ];

  let sidebarItems = [];
  if (userRole === 'god' || user.email === 'god@eduverse.com') {
    sidebarItems = [
      { group: '=== ADMINISTRATION ===' },
      ...aItems.filter(i => !i.group && i.id !== 'home'),
      { group: '=== TEACHING ===' },
      ...tItems.filter(i => !i.group && i.id !== 'home' && i.id !== 'settings'),
      { group: '=== LEARNING ===' },
      ...sItems.filter(i => !i.group && i.id !== 'home' && i.id !== 'profile')
    ];
  } else if (userRole === 'teacher' || userRole === 'Teacher') {
    sidebarItems = tItems;
  } else if (userRole === 'admin' || userRole === 'Admin' || userRole === 'Super Admin') {
    sidebarItems = aItems;
  } else {
    sidebarItems = sItems;
  }

  
  let bottomNavItems = [];
  if (userRole === 'teacher' || userRole === 'Teacher') {
    bottomNavItems = [
      { id: 'home', label: 'Home', icon: '📊', path: '/dashboard' },
      { id: 'courses', label: 'Courses', icon: '📚', path: '/dashboard/teacher/courses' },
      { id: 'live', label: 'Live', icon: '🔴', path: '/dashboard/live-classes' },
      { id: 'students', label: 'Students', icon: '👥', path: '/dashboard/teacher/students' },
      { id: 'menu', label: 'Menu', icon: '☰', path: '#menu' },
    ];
  } else if (userRole === 'admin' || userRole === 'Admin' || userRole === 'Super Admin' || userRole === 'god') {
    bottomNavItems = [
      { id: 'home', label: 'Admin', icon: '📈', path: '/dashboard' },
      { id: 'courses', label: 'Courses', icon: '📚', path: '/admin/courses' },
      { id: 'students', label: 'Users', icon: '👥', path: '/admin/users' },
      { id: 'revenue', label: 'Revenue', icon: '💰', path: '/admin/revenue' },
      { id: 'menu', label: 'Menu', icon: '☰', path: '#menu' },
    ];
  } else {
    bottomNavItems = [
      { id: 'home', label: 'Home', icon: '📊', path: '/dashboard' },
      { id: 'learn', label: 'Learn', icon: '📚', path: '/dashboard/courses' },
      { id: 'tests', label: 'Tests', icon: '🎯', path: '/dashboard/tests' },
      { id: 'doubts', label: 'Doubts', icon: '💬', path: '/dashboard/doubts' },
      { id: 'menu', label: 'Menu', icon: '☰', path: '#menu' },
    ];
  }


  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      <style>
        {`
          .animate-fade-in { animation: fadeIn 0.3s ease-out; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          
          .dashboard-layout { display: flex; flex: 1; overflow: hidden; position: relative; }
          
          /* Custom scrollbar for sidebar */
          .dashboard-sidebar::-webkit-scrollbar { width: 6px; }
          .dashboard-sidebar::-webkit-scrollbar-track { background: transparent; }
          .dashboard-sidebar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
          
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
            overflow-x: hidden;
          }
          
          .sidebar-btn {
            display: flex; 
            align-items: center; 
            gap: 14px; 
            width: 100%; 
            padding: 12px 16px; 
            margin-bottom: 2px; 
            border-radius: 12px; 
            border: none; 
            font-size: 0.95rem;
            cursor: pointer; 
            text-align: left; 
            transition: all 0.2s;
            white-space: nowrap;
          }
          
          .sidebar-btn:hover:not(.active) { background: #f1f5f9; }
          .sidebar-btn.active { background: rgba(37, 99, 235, 0.1); color: #2563eb; font-weight: 700; }
          .sidebar-btn:not(.active) { background: transparent; color: #475569; font-weight: 600; }

          .dashboard-main { 
            flex: 1; 
            padding: 40px; 
            overflow-y: auto; 
            background: #f8fafc; 
            padding-bottom: 80px; /* space for bottom nav on mobile */
          }
          
          .mobile-nav-toggle { 
            display: none; 
            background: #ffffff; 
            padding: 16px 24px; 
            border-bottom: 1px solid #e2e8f0; 
            align-items: center; 
            justify-content: space-between; 
            position: sticky;
            top: 0;
            z-index: 40;
          }

          .mobile-bottom-nav {
            display: none;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #ffffff;
            border-top: 1px solid #e2e8f0;
            box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.05);
            z-index: 50;
            padding: 8px 16px;
            padding-bottom: env(safe-area-inset-bottom, 8px);
            justify-content: space-between;
          }

          .bottom-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            color: #64748b;
            font-size: 0.75rem;
            font-weight: 600;
            text-decoration: none;
            background: none;
            border: none;
            cursor: pointer;
          }

          .bottom-nav-item.active {
            color: #2563eb;
          }
          
          @media (max-width: 900px) {
            .dashboard-sidebar { display: none; } /* Completely hide sidebar on mobile */
            .dashboard-main { padding: 16px 12px 100px 12px; }
            .mobile-nav-toggle { display: flex; }
            .mobile-bottom-nav { display: flex; }
          }
        `}
      </style>

      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }} onClick={() => setMobileMenuOpen(false)}>
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '280px', background: '#fff', padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Menu</div>
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem' }}>✕</button>
            </div>
            {sidebarItems.map((item, idx) => item.group ? (
              <div key={idx} style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', padding: '16px 0 8px 0' }}>{item.group}</div>
            ) : (
              <button 
                key={item.id} 
                onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                style={{ padding: '12px 0', border: 'none', background: 'transparent', textAlign: 'left', display: 'flex', gap: '12px', alignItems: 'center', fontSize: '1rem', color: location.pathname === item.path ? '#2563eb' : '#333', fontWeight: location.pathname === item.path ? 'bold' : 'normal' }}
              >
                <span>{item.icon}</span> <span>{item.label}</span>
              </button>
            ))}
            <button onClick={() => { localStorage.removeItem('becs_user'); navigate('/login'); }} style={{ marginTop: 'auto', padding: '12px 0', color: 'red', border: 'none', background: 'transparent', textAlign: 'left', fontWeight: 'bold' }}>🚪 Logout</button>
          </div>
        </div>
      )}

      {/* Mobile Header */}
      <div className="mobile-nav-toggle">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={avatarUrl} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9' }} />
          <span style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '1.1rem' }}>EduVerse</span>
        </div>
        <NotificationDropdown />
      </div>

      <div className="dashboard-layout">
        {/* Sidebar (Desktop) */}
        <aside className="dashboard-sidebar">
          <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px', padding: '0 8px' }}>
            <img src={avatarUrl} alt="Avatar" style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f1f5f9', border: '2px solid #e2e8f0' }} />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 800, color: 'var(--navy)', fontSize: '1.15rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                {user.role === 'teacher' ? 'Faculty Portal' : 'Student Portal'}
              </div>
            </div>
          </div>

          <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {sidebarItems.map((item, idx) => (
              item.group ? (
                <div key={`group-${idx}`} style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', padding: '16px 16px 4px 16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {item.group}
                </div>
              ) : (
                <button 
                  key={item.id}
                  onClick={() => { if(item.id === 'menu') { setMobileMenuOpen(true); } else { navigate(item.path); setMobileMenuOpen(false); } }}
                  className={`sidebar-btn ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <span style={{ fontSize: '1.2rem', width: '24px', textAlign: 'center' }}>{item.icon}</span>
                  {item.label}
                </button>
              )
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-main" style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Top Global Header (Desktop) */}
          <header style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            paddingBottom: '24px', marginBottom: '32px', borderBottom: '1px solid #e2e8f0',
            '@media (max-width: 900px)': { display: 'none' }
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
              <button onClick={() => navigate('/dashboard/live-classes')} style={{ background: '#fef2f2', color: '#ef4444', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>🔴</span> Live Now
              </button>
              <NotificationDropdown />
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', cursor: 'pointer', border: '2px solid #e2e8f0' }} onClick={() => navigate('/profile')}>
                <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </header>

          
          {location.pathname !== '/dashboard' && (
            <button 
              onClick={() => navigate(-1)} 
              style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#475569', width: 'fit-content', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
            >
              <span>←</span> Go Back
            </button>
          )}
          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>

            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        {bottomNavItems.map(item => (
          <button 
            key={item.id}
            onClick={() => { if(item.id === 'menu') { setMobileMenuOpen(true); } else { navigate(item.path); setMobileMenuOpen(false); } }}
            className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Dashboard;
