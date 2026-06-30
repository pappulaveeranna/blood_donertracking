import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaPhone, FaEnvelope, FaMapMarkerAlt, FaWeight, FaBirthdayCake, FaUser, FaComments, FaPaperPlane } from 'react-icons/fa';
import { MdBloodtype } from 'react-icons/md';

const DonorProfileModal = ({ donor, currentUser, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const messagesEndRef = useRef(null);

  const chatKey = `chat_${[currentUser.email, donor.email].sort().join('_')}`;

  useEffect(() => {
    // Send profile view notification to donor
    if (currentUser.email !== donor.email) {
      const notifications = JSON.parse(localStorage.getItem(`notifications_${donor.email}`) || '[]');
      const alreadyViewed = notifications.find(
        n => n.viewerEmail === currentUser.email && n.type === 'profile_view' &&
        Date.now() - n.timestamp < 60000 // avoid duplicate within 1 min
      );
      if (!alreadyViewed) {
        notifications.unshift({
          id: Date.now(),
          type: 'profile_view',
          viewerName: currentUser.name,
          viewerEmail: currentUser.email,
          message: `${currentUser.name} viewed your profile`,
          timestamp: Date.now(),
          read: false
        });
        localStorage.setItem(`notifications_${donor.email}`, JSON.stringify(notifications));
      }
    }

    // Load chat messages
    const saved = JSON.parse(localStorage.getItem(chatKey) || '[]');
    setMessages(saved);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg = {
      id: Date.now(),
      senderEmail: currentUser.email,
      senderName: currentUser.name,
      text: newMessage.trim(),
      timestamp: Date.now()
    };
    const updated = [...messages, msg];
    setMessages(updated);
    localStorage.setItem(chatKey, JSON.stringify(updated));
    setNewMessage('');

    // Notify donor of new message
    if (currentUser.email !== donor.email) {
      const notifications = JSON.parse(localStorage.getItem(`notifications_${donor.email}`) || '[]');
      notifications.unshift({
        id: Date.now(),
        type: 'message',
        viewerName: currentUser.name,
        viewerEmail: currentUser.email,
        message: `${currentUser.name} sent you a message: "${newMessage.trim().substring(0, 40)}..."`,
        timestamp: Date.now(),
        read: false
      });
      localStorage.setItem(`notifications_${donor.email}`, JSON.stringify(notifications));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div className="modal-header" style={{ flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.4rem', fontWeight: 'bold' }}>
              {donor.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style={{ margin: 0, color: '#dc2626' }}>{donor.name}</h3>
              <span style={{ fontSize: '0.85rem', color: '#666' }}>{donor.bloodGroup} • {donor.location?.city}</span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}><FaTimes /></button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid #f3f4f6', flexShrink: 0 }}>
          <button onClick={() => setActiveTab('profile')} style={{
            flex: 1, padding: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold',
            background: activeTab === 'profile' ? '#fff5f5' : 'white',
            color: activeTab === 'profile' ? '#dc2626' : '#666',
            borderBottom: activeTab === 'profile' ? '2px solid #dc2626' : 'none'
          }}>
            <FaUser size={14} /> Profile
          </button>
          <button onClick={() => setActiveTab('chat')} style={{
            flex: 1, padding: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold',
            background: activeTab === 'chat' ? '#fff5f5' : 'white',
            color: activeTab === 'chat' ? '#dc2626' : '#666',
            borderBottom: activeTab === 'chat' ? '2px solid #dc2626' : 'none'
          }}>
            <FaComments size={14} /> Chat
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div style={{ overflowY: 'auto', padding: '1.5rem', flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '4px' }}>BLOOD GROUP</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#dc2626' }}>{donor.bloodGroup}</div>
              </div>
              <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '4px' }}>STATUS</div>
                <div style={{
                  display: 'inline-block', padding: '4px 12px', borderRadius: '15px', fontSize: '0.85rem',
                  backgroundColor: donor.isAvailable ? '#27ae60' : '#e74c3c', color: 'white', fontWeight: 'bold'
                }}>
                  {donor.isAvailable ? '✓ Available' : '✗ Not Available'}
                </div>
              </div>
              <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '4px' }}><FaBirthdayCake size={11} /> AGE</div>
                <div style={{ fontWeight: '600' }}>{donor.age} years</div>
              </div>
              <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '4px' }}><FaWeight size={11} /> WEIGHT</div>
                <div style={{ fontWeight: '600' }}>{donor.weight} kg</div>
              </div>
            </div>

            <div style={{ marginTop: '1rem', background: '#f9fafb', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '4px' }}><FaMapMarkerAlt size={11} /> LOCATION</div>
              <div style={{ fontWeight: '600' }}>{donor.location?.address}</div>
              <div>{donor.location?.city}, {donor.location?.state} - {donor.location?.pincode}</div>
            </div>

            <div style={{ marginTop: '1rem', background: '#f9fafb', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '4px' }}><FaPhone size={11} /> CONTACT</div>
              <div><a href={`tel:${donor.phone}`} style={{ color: '#dc2626', textDecoration: 'none', fontWeight: '600' }}>{donor.phone}</a></div>
              <div><a href={`mailto:${donor.email}`} style={{ color: '#dc2626', textDecoration: 'none' }}>{donor.email}</a></div>
            </div>

            {donor.medicalHistory && (
              <div style={{ marginTop: '1rem', background: '#f9fafb', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '4px' }}>MEDICAL HISTORY</div>
                <div>{donor.medicalHistory}</div>
              </div>
            )}

            <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#999', textAlign: 'center' }}>
              Registered: {donor.createdAt ? new Date(donor.createdAt).toLocaleDateString() : 'N/A'}
            </div>

            {currentUser.email !== donor.email && (
              <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}
                onClick={() => setActiveTab('chat')}>
                <FaComments size={14} /> Chat with {donor.name}
              </button>
            )}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', background: '#f9fafb' }}>
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', color: '#999', marginTop: '2rem' }}>
                  <FaComments size={40} color="#ddd" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              )}
              {messages.map(msg => (
                <div key={msg.id} style={{
                  display: 'flex',
                  justifyContent: msg.senderEmail === currentUser.email ? 'flex-end' : 'flex-start',
                  marginBottom: '10px'
                }}>
                  <div style={{
                    maxWidth: '70%', padding: '10px 14px', borderRadius: '18px',
                    background: msg.senderEmail === currentUser.email ? '#dc2626' : 'white',
                    color: msg.senderEmail === currentUser.email ? 'white' : '#333',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '4px' }}>{msg.senderName}</div>
                    <div>{msg.text}</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '4px', textAlign: 'right' }}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '1rem', background: 'white', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Type a message..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && sendMessage()}
                style={{ flex: 1, margin: 0 }}
              />
              <button className="btn btn-primary" onClick={sendMessage} style={{ padding: '8px 16px' }}>
                <FaPaperPlane size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorProfileModal;
