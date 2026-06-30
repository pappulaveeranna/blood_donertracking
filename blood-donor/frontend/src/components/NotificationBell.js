import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaTimes, FaEye, FaComments } from 'react-icons/fa';

const NotificationBell = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadNotifications();
    // Poll every 5 seconds for new notifications
    const interval = setInterval(loadNotifications, 5000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = () => {
    const saved = JSON.parse(localStorage.getItem(`notifications_${user.email}`) || '[]');
    setNotifications(saved);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem(`notifications_${user.email}`, JSON.stringify(updated));
  };

  const deleteNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem(`notifications_${user.email}`, JSON.stringify(updated));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.setItem(`notifications_${user.email}`, JSON.stringify([]));
  };

  const timeAgo = (timestamp) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => { setOpen(!open); if (!open) markAllRead(); }}
        style={{
          position: 'relative', background: 'none', border: 'none',
          cursor: 'pointer', padding: '8px', color: 'white'
        }}
      >
        <FaBell size={22} color="white" />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: '2px', right: '2px',
            background: '#ff4444', color: 'white', borderRadius: '50%',
            width: '18px', height: '18px', fontSize: '0.7rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', animation: 'pulse 1s infinite'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '110%',
          width: '340px', background: 'white', borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)', zIndex: 9999,
          maxHeight: '400px', display: 'flex', flexDirection: 'column'
        }}>
          <div style={{
            padding: '14px 16px', borderBottom: '1px solid #f3f4f6',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <h4 style={{ margin: 0, color: '#dc2626' }}>🔔 Notifications</h4>
            {notifications.length > 0 && (
              <button onClick={clearAll} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#999', fontSize: '0.8rem'
              }}>Clear all</button>
            )}
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                <FaBell size={30} color="#ddd" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => (
                <div key={n.id} style={{
                  padding: '12px 16px', borderBottom: '1px solid #f9fafb',
                  background: n.read ? 'white' : '#fff5f5',
                  display: 'flex', alignItems: 'flex-start', gap: '10px'
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: n.type === 'profile_view' ? '#dbeafe' : '#dcfce7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {n.type === 'profile_view'
                      ? <FaEye size={16} color="#2563eb" />
                      : <FaComments size={16} color="#16a34a" />
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', color: '#333' }}>{n.message}</div>
                    <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '2px' }}>{timeAgo(n.timestamp)}</div>
                  </div>
                  <button onClick={() => deleteNotification(n.id)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#ccc', padding: '2px', flexShrink: 0
                  }}>
                    <FaTimes size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
