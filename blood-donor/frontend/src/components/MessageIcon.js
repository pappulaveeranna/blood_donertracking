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
    // Find all chat keys involving current user
    const allKeys = Object.keys(localStorage).filter(k => k.startsWith('chat_') && k.includes(user.email));
    let unread = 0;
    const chatList = allKeys.map(key => {
      const msgs = JSON.parse(localStorage.getItem(key) || '[]');
      const otherEmail = key.replace('chat_', '').replace(user.email, '').replace('_', '').replace('_', '');
      const lastMsg = msgs[msgs.length - 1];
      // Count unread: messages not from current user, after last read time
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
    // Mark as read
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
    setNewMessage('');

    // Notify the other person
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
    loadChats();
  };

  const getOtherName = (chat) => {
    const lastMsg = chat.msgs.find(m => m.senderEmail !== user.email);
    return lastMsg ? lastMsg.senderName : chat.otherEmail;
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
      {/* Message Icon Button */}
      <button
        onClick={() => { setOpen(!open); setActiveChat(null); }}
        style={{
          position: 'relative', background: 'none', border: 'none',
          cursor: 'pointer', padding: '8px', color: 'white'
        }}
      >
        <FaComments size={22} color="white" />
        {totalUnread > 0 && (
          <span style={{
            position: 'absolute', top: '2px', right: '2px',
            background: '#22c55e', color: 'white', borderRadius: '50%',
            width: '18px', height: '18px', fontSize: '0.7rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            {totalUnread > 9 ? '9+' : totalUnread}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '110%',
          width: '340px', background: 'white', borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.18)', zIndex: 9999,
          maxHeight: '480px', display: 'flex', flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 16px', background: 'linear-gradient(135deg,#dc2626,#ef4444)',
            color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            {activeChat ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button onClick={() => setActiveChat(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                  <FaArrowLeft size={14} />
                </button>
                <span style={{ fontWeight: 'bold' }}>{getOtherName(activeChat)}</span>
              </div>
            ) : (
              <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>💬 Messages</span>
            )}
            <button onClick={() => { setOpen(false); setActiveChat(null); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              <FaTimes size={16} />
            </button>
          </div>

          {/* Chat List */}
          {!activeChat && (
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {chats.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                  <FaComments size={36} color="#ddd" />
                  <p style={{ marginTop: '8px' }}>No messages yet</p>
                  <p style={{ fontSize: '0.8rem' }}>View a donor's profile to start chatting</p>
                </div>
              ) : (
                chats.map(chat => (
                  <div key={chat.key}
                    onClick={() => setActiveChat(chat)}
                    style={{
                      padding: '12px 16px', borderBottom: '1px solid #f3f4f6',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                      background: chat.unreadCount > 0 ? '#fff5f5' : 'white',
                      transition: 'background 0.2s'
                    }}
                  >
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '50%',
                      background: '#dc2626', color: 'white', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontWeight: 'bold', fontSize: '1.1rem', flexShrink: 0
                    }}>
                      {getOtherName(chat).charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: chat.unreadCount > 0 ? 'bold' : '500', color: '#333' }}>
                          {getOtherName(chat)}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#999' }}>
                          {timeAgo(chat.lastMsg?.timestamp)}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {chat.lastMsg ? `${chat.lastMsg.senderEmail === user.email ? 'You: ' : ''}${chat.lastMsg.text}` : 'No messages yet'}
                      </div>
                    </div>
                    {chat.unreadCount > 0 && (
                      <span style={{
                        background: '#dc2626', color: 'white', borderRadius: '50%',
                        width: '20px', height: '20px', fontSize: '0.7rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Active Chat Messages */}
          {activeChat && (
            <>
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px', background: '#f9fafb', maxHeight: '320px' }}>
                {messages.length === 0 && (
                  <div style={{ textAlign: 'center', color: '#999', marginTop: '1rem' }}>
                    <p>Start the conversation!</p>
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
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)', fontSize: '0.9rem'
                    }}>
                      <div>{msg.text}</div>
                      <div style={{ fontSize: '0.65rem', opacity: 0.7, marginTop: '2px', textAlign: 'right' }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div style={{ padding: '10px', background: 'white', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && sendMessage()}
                  style={{ flex: 1, margin: 0, padding: '8px 12px', fontSize: '0.9rem' }}
                />
                <button onClick={sendMessage} className="btn btn-primary" style={{ padding: '8px 14px' }}>
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
