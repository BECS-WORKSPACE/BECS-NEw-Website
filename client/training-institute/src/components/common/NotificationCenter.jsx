import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaBell, FaCog, FaTimes } from 'react-icons/fa';
import './NotificationCenter.css';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = Array.isArray(notifications) ? notifications.filter(n => n?.status === 'unread').length : 0;

  useEffect(() => {
    fetchNotifications();
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications', { withCredentials: true });
      if (Array.isArray(res.data)) {
        setNotifications(res.data);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Failed to fetch notifications');
    }
  };

  const fetchPreferences = async () => {
    try {
      const res = await axios.get('/api/notifications/preferences', { withCredentials: true });
      if (res.data && res.data.channels && res.data.topics) {
        setPreferences(res.data);
        setShowSettings(true);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error('Failed to fetch preferences');
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`, {}, { withCredentials: true });
      setNotifications(notifications.map(n => n._id === id ? { ...n, status: 'read' } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/read-all', {}, { withCredentials: true });
      setNotifications(notifications.map(n => ({ ...n, status: 'read' })));
    } catch (error) {
      console.error(error);
    }
  };

  const togglePreference = async (category, key, value) => {
    try {
      const updated = { ...preferences, [category]: { ...preferences[category], [key]: value } };
      setPreferences(updated);
      await axios.put('/api/notifications/preferences', { [category]: { [key]: value } }, { withCredentials: true });
    } catch (error) {
      console.error('Failed to update preference');
    }
  };

  return (
    <div className="notification-center-container" ref={dropdownRef}>
      {/* Bell Icon */}
      <button 
        onClick={() => { setShowDropdown(!showDropdown); setShowSettings(false); }}
        className="notification-bell-btn"
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <div className="notification-actions">
              <button onClick={markAllAsRead}>Mark all read</button>
              <button onClick={fetchPreferences} className="settings-btn" title="Settings">
                <FaCog />
              </button>
            </div>
          </div>
          
          <div className="notification-list">
            {(!Array.isArray(notifications) || notifications.length === 0) ? (
              <div className="notification-empty">No notifications yet.</div>
            ) : (
              notifications.map(notif => (
                <div 
                  key={notif._id} 
                  className={`notification-item ${notif.status === 'unread' ? 'unread' : ''}`}
                >
                  <div className="notification-item-header">
                    <h4>{notif.title}</h4>
                    <span className="notification-date">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="notification-message">{notif.message}</p>
                  
                  <div className="notification-footer">
                    {notif.actionLink && notif.actionText ? (
                      <a href={notif.actionLink} className="notification-link">
                        {notif.actionText} &rarr;
                      </a>
                    ) : <div></div>}
                    
                    {notif.status === 'unread' && (
                      <button onClick={() => markAsRead(notif._id)} className="mark-read-btn">
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && preferences && (
        <div className="notification-settings-overlay">
          <div className="notification-settings-modal">
            <div className="settings-header">
              <h2>Notification Preferences</h2>
              <button onClick={() => setShowSettings(false)} className="close-settings-btn">
                <FaTimes />
              </button>
            </div>
            
            <div className="settings-content">
              <div className="settings-section">
                <h3>Delivery Channels</h3>
                <div className="settings-list">
                  {Object.keys(preferences.channels).map(key => (
                    <div key={key} className="setting-row">
                      <span className="setting-label">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <button 
                        onClick={() => togglePreference('channels', key, !preferences.channels[key])}
                        className={`toggle-switch ${preferences.channels[key] ? 'active' : ''}`}
                      >
                        <span className="toggle-knob" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="settings-section">
                <h3>Topics</h3>
                <div className="settings-list">
                  {Object.keys(preferences.topics).map(key => {
                    const isDisabled = key === 'payments' || key === 'security';
                    return (
                      <div key={key} className="setting-row">
                        <span className="setting-label">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <button 
                          onClick={() => !isDisabled && togglePreference('topics', key, !preferences.topics[key])}
                          disabled={isDisabled}
                          className={`toggle-switch ${preferences.topics[key] || isDisabled ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                        >
                          <span className="toggle-knob" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
