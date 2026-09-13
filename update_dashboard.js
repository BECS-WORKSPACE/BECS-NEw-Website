const fs = require('fs');

let file = fs.readFileSync('client/training-institute/src/pages/Dashboard.jsx', 'utf8');

file = file.replace(/const sidebarItems = \(userRole === 'teacher' \|\| userRole === 'Teacher'\) \? \[/g, 
`
  const teacherItems = [
    { id: 'home', label: 'Teacher Overview', icon: '📊', path: '/dashboard' },
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

  const adminItems = [
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

  const studentItems = [
    { id: 'home', label: 'My Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'courses', label: 'My Courses', icon: '📚', path: '/dashboard/courses' },
    { id: 'subscription', label: 'My Subscription', icon: '💳', path: '/dashboard/subscription' },
    { id: 'live', label: 'Live Classes', icon: '🔴', path: '/dashboard/live-classes' },
    { id: 'tests', label: 'Mock Tests', icon: '🎯', path: '/dashboard/tests' },
    { id: 'analytics', label: 'Learning Analytics', icon: '🧠', path: '/dashboard/analytics' },
    { id: 'calendar', label: 'Calendar', icon: '📅', path: '/dashboard/calendar' },
    { id: 'settings', label: 'Profile Settings', icon: '⚙️', path: '/profile' },
  ];

  let sidebarItems = [];
  if (userRole === 'god') {
    sidebarItems = [
      { group: 'ADMINISTRATION' },
      ...adminItems,
      { group: 'TEACHING' },
      ...teacherItems,
      { group: 'LEARNING' },
      ...studentItems
    ];
  } else if (userRole === 'teacher' || userRole === 'Teacher') {
    sidebarItems = teacherItems;
  } else if (userRole === 'admin' || userRole === 'Admin' || userRole === 'Super Admin') {
    sidebarItems = adminItems;
  } else {
    sidebarItems = studentItems;
  }

  // To cleanly remove old sidebar definition:
  /*
`);

// The problem is that the original file has:
//   const sidebarItems = (userRole === 'teacher' || userRole === 'Teacher') ? [ ... ] : (userRole === 'admin' || userRole === 'Admin') ? [ ... ] : [ ... ];
// We should use string replacement cleanly.

