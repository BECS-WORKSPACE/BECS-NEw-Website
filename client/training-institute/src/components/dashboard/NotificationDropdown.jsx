import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Dummy notifications
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'live', title: 'Live Class Starting Soon', message: 'System Design with Mr. Sharma starts in 15 mins.', time: '15m ago', isRead: false },
    { id: 2, type: 'payment', title: 'Payment Successful', message: 'Your Premium Subscription has been activated.', time: '2h ago', isRead: false },
    { id: 3, type: 'assignment', title: 'Assignment Due', message: 'Data Science Assignment is due tomorrow.', time: '1d ago', isRead: false },
    { id: 4, type: 'system', title: 'New Course Added', message: 'Mastering Next.js 14 is now available.', time: '2d ago', isRead: true }
  ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'live': return { icon: '🔴', bg: '#fee2e2' };
      case 'payment': return { icon: '💳', bg: '#dcfce7' };
      case 'assignment': return { icon: '📝', bg: '#fef3c7' };
      default: return { icon: '🔔', bg: '#e0e7ff' };
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', 
          position: 'relative', width: '44px', height: '44px', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s',
          backgroundColor: isOpen ? '#f1f5f9' : 'transparent'
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{ position: 'absolute', top: '4px', right: '4px', background: '#ef4444', color: 'white', fontSize: '0.7rem', fontWeight: 800, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #ffffff' }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{ 
          position: 'absolute', top: 'calc(100% + 8px)', right: '-10px', width: '380px', 
          background: '#ffffff', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', 
          border: '1px solid #e2e8f0', zIndex: 100, overflow: 'hidden', animation: 'fadeIn 0.2s ease-out'
        }}>
          
          <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--navy)', fontWeight: 700 }}>Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} style={{ background: 'transparent', border: 'none', color: '#3b82f6', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                Mark all as read
              </button>
            )}
          </div>

          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>📭</span>
                No new notifications
              </div>
            ) : (
              notifications.map((notif) => {
                const { icon, bg } = getIcon(notif.type);
                return (
                  <div 
                    key={notif.id} 
                    onClick={() => markAsRead(notif.id)}
                    style={{ 
                      padding: '16px 20px', display: 'flex', gap: '16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer',
                      background: notif.isRead ? '#ffffff' : '#f8fafc', transition: 'background 0.2s'
                    }}
                  >
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                      {icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', color: notif.isRead ? '#475569' : 'var(--navy)', fontWeight: notif.isRead ? 600 : 700 }}>{notif.title}</h4>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500, whiteSpace: 'nowrap', marginLeft: '8px' }}>{notif.time}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: 1.4 }}>{notif.message}</p>
                    </div>
                    {!notif.isRead && (
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', marginTop: '6px' }}></div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div style={{ padding: '12px', borderTop: '1px solid #e2e8f0', textAlign: 'center', background: '#f8fafc' }}>
            <button 
              onClick={() => { setIsOpen(false); navigate('/dashboard/notifications'); }} 
              style={{ background: 'transparent', border: 'none', color: '#3b82f6', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', width: '100%' }}
            >
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
