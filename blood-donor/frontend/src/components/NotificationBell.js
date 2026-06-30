import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaTimes, FaEye, FaComments, FaExclamationTriangle, FaUser } from 'react-icons/fa';

const NotificationBell = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [reportModal, setReportModal] = useState(null);
  const [viewerModal, setViewerModal] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [reportSent, setReportSent] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadNotifications();
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

  const handleReport = () => {
    if (!reportReason.trim()) return;
    const reports = JSON.parse(localStorage.getItem('bloodapp_reports') || '[]');
    reports.push({
      id: Date.now(),
      reportedBy: user.email,
      reportedByName: user.name,
      reportedUser: reportModal.viewerEmail,
      reportedUserName: reportModal.viewerName,
      reason: reportReason,
      timestamp: Date.now()
    });
    localStorage.setItem('bloodapp_reports', JSON.stringify(reports));
    setReportSent(true);
    setReportReason('');
    setTimeout(() => {
      setReportSent(false);
      setReportModal(null);
    }, 2000);
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

  const reportReasons = [
    'Spam or fake profile',
    'Inappropriate behavior',
    'Harassment',
    'Suspicious activity',
    'Wrong information',
    'Other'
  ];

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button className="nav-icon-btn" onClick={() => { setOpen(!open); if (!open) markAllRead(); }}>
        <FaBell size={20} color="white" />
        {unreadCount > 0 && (
          <span className="nav-icon-badge red">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'fixed', top: '70px', right: '30px',
          width: '360px', background: 'white', borderRadius: '14px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)', zIndex: 99999,
          maxHeight: '480px', display: 'flex', flexDirection: 'column',
          border: '1px solid #f3f4f6', overflow: 'hidden'
        }}>

          {/* Header */}
          <div style={{
            padding: '14px 16px',
            background: 'linear-gradient(135deg,#dc2626,#ef4444)',
            color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaBell size={16} />
              <span style={{ fontWeight: 'bold' }}>Notifications</span>
              {unreadCount > 0 && (
                <span style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '10px', padding: '2px 8px', fontSize: '0.78rem' }}>
                  {unreadCount} new
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {notifications.length > 0 && (
                <button onClick={clearAll} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', color: 'white', fontSize: '0.75rem', borderRadius: '6px', padding: '3px 8px' }}>
                  Clear all
                </button>
              )}
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
                <FaTimes size={15} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#999' }}>
                <FaBell size={36} color="#e5e7eb" />
                <p style={{ marginTop: '10px', fontWeight: '500' }}>No notifications yet</p>
                <p style={{ fontSize: '0.8rem' }}>You'll see who viewed your profile here</p>
              </div>
            ) : (
              notifications.map(n => (
                <div key={n.id} style={{
                  padding: '12px 16px', borderBottom: '1px solid #f9fafb',
                  background: n.read ? 'white' : '#fff5f5',
                  transition: 'background 0.2s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>

                    {/* Avatar */}
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                      background: n.type === 'profile_view'
                        ? 'linear-gradient(135deg,#3b82f6,#6366f1)'
                        : 'linear-gradient(135deg,#22c55e,#16a34a)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 'bold', fontSize: '1rem'
                    }}>
                      {n.viewerName?.charAt(0).toUpperCase()}
                    </div>

                    <div style={{ flex: 1 }}>
                      {/* Message */}
                      <div style={{ fontSize: '0.88rem', color: '#333', fontWeight: n.read ? 'normal' : '600' }}>
                        {n.type === 'profile_view' ? (
                          <>
                            <span style={{ color: '#dc2626', fontWeight: 'bold' }}>{n.viewerName}</span>
                            {' viewed your profile'}
                          </>
                        ) : (
                          <>
                            <span style={{ color: '#16a34a', fontWeight: 'bold' }}>{n.viewerName}</span>
                            {' sent you a message'}
                          </>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '3px' }}>
                        {n.type === 'profile_view' ? '👁️' : '💬'} {timeAgo(n.timestamp)}
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                        <button
                          onClick={() => { setViewerModal(n); setOpen(false); }}
                          style={{
                            background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe',
                            borderRadius: '6px', padding: '3px 10px', fontSize: '0.75rem',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                          }}>
                          <FaUser size={10} /> View Details
                        </button>
                        <button
                          onClick={() => { setReportModal(n); setOpen(false); }}
                          style={{
                            background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
                            borderRadius: '6px', padding: '3px 10px', fontSize: '0.75rem',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                          }}>
                          <FaExclamationTriangle size={10} /> Report
                        </button>
                      </div>
                    </div>

                    <button onClick={() => deleteNotification(n.id)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#ccc', padding: '2px', flexShrink: 0
                    }}>
                      <FaTimes size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Viewer Details Modal */}
      {viewerModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 999999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setViewerModal(null)}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '2rem',
            width: '340px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
          }} onClick={e => e.stopPropagation()}>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '70px', height: '70px', borderRadius: '50%', margin: '0 auto 12px',
                background: 'linear-gradient(135deg,#dc2626,#ef4444)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '1.8rem', fontWeight: 'bold'
              }}>
                {viewerModal.viewerName?.charAt(0).toUpperCase()}
              </div>
              <h3 style={{ margin: 0, color: '#333' }}>{viewerModal.viewerName}</h3>
              <p style={{ color: '#999', fontSize: '0.85rem', marginTop: '4px' }}>{viewerModal.viewerEmail}</p>
            </div>

            <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '14px', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#999', marginBottom: '6px' }}>ACTION</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {viewerModal.type === 'profile_view'
                  ? <><FaEye color="#3b82f6" size={16} /> <span style={{ fontWeight: '600' }}>Viewed your profile</span></>
                  : <><FaComments color="#22c55e" size={16} /> <span style={{ fontWeight: '600' }}>Sent you a message</span></>
                }
              </div>
              <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '6px' }}>
                🕐 {timeAgo(viewerModal.timestamp)} • {new Date(viewerModal.timestamp).toLocaleString()}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { setReportModal(viewerModal); setViewerModal(null); }}
                style={{
                  flex: 1, padding: '10px', background: '#fef2f2', color: '#dc2626',
                  border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer',
                  fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}>
                <FaExclamationTriangle size={13} /> Report User
              </button>
              <button onClick={() => setViewerModal(null)}
                style={{
                  flex: 1, padding: '10px', background: '#f3f4f6', color: '#666',
                  border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
                }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 999999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setReportModal(null)}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '2rem',
            width: '380px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
          }} onClick={e => e.stopPropagation()}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <FaExclamationTriangle color="#dc2626" size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: '#333' }}>Report User</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#999' }}>Reporting: {reportModal.viewerName}</p>
                </div>
              </div>
              <button onClick={() => setReportModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>
                <FaTimes size={18} />
              </button>
            </div>

            {reportSent ? (
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: '3rem' }}>✅</div>
                <h4 style={{ color: '#16a34a', marginTop: '8px' }}>Report Submitted!</h4>
                <p style={{ color: '#666', fontSize: '0.88rem' }}>Thank you. We'll review this report.</p>
              </div>
            ) : (
              <>
                <p style={{ color: '#666', fontSize: '0.88rem', marginBottom: '1rem' }}>
                  Why are you reporting <strong>{reportModal.viewerName}</strong>?
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem' }}>
                  {reportReasons.map(reason => (
                    <label key={reason} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 14px', borderRadius: '8px', cursor: 'pointer',
                      border: reportReason === reason ? '2px solid #dc2626' : '1px solid #e5e7eb',
                      background: reportReason === reason ? '#fff5f5' : 'white',
                      transition: 'all 0.2s'
                    }}>
                      <input
                        type="radio"
                        name="reportReason"
                        value={reason}
                        checked={reportReason === reason}
                        onChange={() => setReportReason(reason)}
                        style={{ accentColor: '#dc2626' }}
                      />
                      <span style={{ fontSize: '0.88rem', color: '#333' }}>{reason}</span>
                    </label>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={handleReport}
                    disabled={!reportReason}
                    style={{
                      flex: 1, padding: '11px',
                      background: reportReason ? 'linear-gradient(135deg,#dc2626,#ef4444)' : '#e5e7eb',
                      color: reportReason ? 'white' : '#999',
                      border: 'none', borderRadius: '8px', cursor: reportReason ? 'pointer' : 'not-allowed',
                      fontWeight: '600', fontSize: '0.9rem'
                    }}>
                    Submit Report
                  </button>
                  <button onClick={() => setReportModal(null)}
                    style={{
                      padding: '11px 18px', background: '#f3f4f6', color: '#666',
                      border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
                    }}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
