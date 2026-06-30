import React, { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';

const MessageIcon = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [totalUnread, setTotalUnread] = useState(0);
  const dropdownRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadChats();
    const interval = setInterval(loadChats, 3000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (activeChat) loadMessages(activeChat);
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setActiveChat(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadChats = () => {
    const allKeys = Object.keys(localStorage).filter(k => k.startsWith('chat_') && k.includes(user.email));
    let unread = 0;
    const chatList = allKeys.map(key => {
      const msgs = JSON.parse(localStorage.getItem(key) || '[]');
      const parts = key.replace('chat_', '').split('_');
      const otherEmail = parts.find(p => p !== user.email) || '';
      const lastMsg = msgs[msgs.length - 1];
      const lastRead = parseInt(localStorage.getItem(`lastread_${key}_${user.email}`) || '0');
      const unreadCount = msgs.filter(m => m.senderEmail !== user.email && m.timestamp > lastRead).length;
      unread += unreadCount;
      return { key, otherEmail, lastMsg, unreadCount, msgs };
    });
    setChats(chatList);
    setTotalUnread(unread);
  };

  const loadMessages = (chat) => {
    const msgs = JSON.parse(localStorage.getItem(chat.key) || '[]');
    setMessages(msgs);
    localStorage.setItem(`lastread_${chat.key}_${user.email}`, Date.now().toString());
    loadChats();
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;
    const msg = {
      id: Date.now(),
      senderEmail: user.email,
      senderName: user.name,
      text: newMessage.trim(),
      timestamp: Date.now()
    };
    const updated = [...messages, msg];
    setMessages(updated);
    localStorage.setItem(activeChat.key, JSON.stringify(updated));

    const notifications = JSON.parse(localStorage.getItem(`notifications_${activeChat.otherEmail}`) || '[]');
    notifications.unshift({
      id: Date.now(),
      type: 'message',
      viewerName: user.name,
      viewerEmail: user.email,
      message: `${user.name} sent you a message: "${newMessage.trim().substring(0, 40)}"`,
      timestamp: Date.now(),
      read: false
    });
    localStorage.setItem(`notifications_${activeChat.otherEmail}`, JSON.stringify(notifications));
    setNewMessage('');
    loadChats();
  };

  const getOtherName = (chat) => {
    const msg = chat.msgs.find(m => m.senderEmail !== user.email);
    return msg ? msg.senderName : chat.otherEmail;
  };

  const timeAgo = (timestamp) => {
    if (!timestamp) return '';
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'now';
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h`;
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>

      {/* 💬 Message Button */}
      <button className="nav-icon-btn" onClick={() => { setOpen(!open); setActiveChat(null); }}>
        <FaComments size={20} color="white" />
        {totalUnread > 0 && (
          <span className="nav-icon-badge green">{totalUnread > 9 ? '9+' : totalUnread}</span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'fixed',
          top: '70px',
          right: '80px',
          width: '340px',
          background: 'white',
          borderRadius: '14px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          zIndex: 99999,
          maxHeight: '500px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #f3f4f6'
        }}>

          {/* Top bar */}
          <div style={{
            padding: '14px 16px',
            background: 'linear-gradient(135deg, #dc2626, #ef4444)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0
          }}>
            {activeChat ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button onClick={() => setActiveChat(null)}
                  style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '2px' }}>
                  <FaArrowLeft size={14} />
                </button>
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.3)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                }}>
                  {getOtherName(activeChat).charAt(0).toUpperCase()}
                </div>
                <span style={{ fontWeight: 'bold' }}>{getOtherName(activeChat)}</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaComments size={16} />
                <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>Messages</span>
                {totalUnread > 0 && (
                  <span style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '10px', padding: '2px 8px', fontSize: '0.8rem' }}>
                    {totalUnread} new
                  </span>
                )}
              </div>
            )}
            <button onClick={() => { setOpen(false); setActiveChat(null); }}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              <FaTimes size={16} />
            </button>
          </div>

          {/* Chat List */}
          {!activeChat && (
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {chats.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#999' }}>
                  <FaComments size={40} color="#e5e7eb" />
                  <p style={{ marginTop: '10px', fontWeight: '500' }}>No messages yet</p>
                  <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Go to Donors → View Profile to start chatting</p>
                </div>
              ) : (
                chats.map(chat => (
                  <div key={chat.key} onClick={() => setActiveChat(chat)}
                    style={{
                      padding: '12px 16px', borderBottom: '1px solid #f3f4f6',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                      background: chat.unreadCount > 0 ? '#fff5f5' : 'white',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                    onMouseLeave={e => e.currentTarget.style.background = chat.unreadCount > 0 ? '#fff5f5' : 'white'}
                  >
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg,#dc2626,#ef4444)',
                      color: 'white', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem'
                    }}>
                      {getOtherName(chat).charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span style={{ fontWeight: chat.unreadCount > 0 ? 'bold' : '500', color: '#333', fontSize: '0.95rem' }}>
                          {getOtherName(chat)}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#999' }}>{timeAgo(chat.lastMsg?.timestamp)}</span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {chat.lastMsg
                          ? `${chat.lastMsg.senderEmail === user.email ? 'You: ' : ''}${chat.lastMsg.text}`
                          : 'No messages yet'}
                      </div>
                    </div>
                    {chat.unreadCount > 0 && (
                      <span style={{
                        background: '#dc2626', color: 'white', borderRadius: '50%',
                        width: '20px', height: '20px', fontSize: '0.7rem', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                      }}>
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Active Chat */}
          {activeChat && (
            <>
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px', background: '#f9fafb', minHeight: '280px', maxHeight: '350px' }}>
                {messages.length === 0 && (
                  <div style={{ textAlign: 'center', color: '#aaa', marginTop: '2rem', fontSize: '0.9rem' }}>
                    Say hi to start the conversation! 👋
                  </div>
                )}
                {messages.map(msg => (
                  <div key={msg.id} style={{
                    display: 'flex',
                    justifyContent: msg.senderEmail === user.email ? 'flex-end' : 'flex-start',
                    marginBottom: '8px'
                  }}>
                    <div style={{
                      maxWidth: '75%', padding: '8px 12px', borderRadius: '16px',
                      background: msg.senderEmail === user.email ? '#dc2626' : 'white',
                      color: msg.senderEmail === user.email ? 'white' : '#333',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)', fontSize: '0.88rem'
                    }}>
                      <div>{msg.text}</div>
                      <div style={{ fontSize: '0.63rem', opacity: 0.7, marginTop: '3px', textAlign: 'right' }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div style={{ padding: '10px 12px', background: 'white', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '8px', flexShrink: 0 }}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && sendMessage()}
                  style={{
                    flex: 1, border: '1.5px solid #e5e7eb', borderRadius: '20px',
                    padding: '8px 14px', fontSize: '0.88rem', outline: 'none'
                  }}
                />
                <button onClick={sendMessage}
                  style={{
                    background: 'linear-gradient(135deg,#dc2626,#ef4444)',
                    color: 'white', border: 'none', borderRadius: '50%',
                    width: '36px', height: '36px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                  <FaPaperPlane size={13} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageIcon;
