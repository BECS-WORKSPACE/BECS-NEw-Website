import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import api from '../../api';

// For UI demo, hardcoding local URL. In prod, use environment variable.
const SOCKET_URL = 'http://localhost:5000';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { _id: '1', senderId: 'teacher1', body: 'Welcome to the React Bootcamp batch chat!', isSelf: false },
    { _id: '2', senderId: 'student1', body: 'Excited to be here! When does the first assignment drop?', isSelf: true },
    { _id: '3', senderId: 'teacher1', body: 'It will be unlocked after you finish Chapter 1.', isSelf: false }
  ]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  
  // Dummy Conversation ID for UI
  const conversationId = 'react-batch-101';

  useEffect(() => {
    // Connect to Socket.io backend built in Phase 2
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join_chat_room', { conversationId, userId: 'demo_user' });
    });

    newSocket.on('receive_message', (message) => {
      // In a real app, you map senderId to determine isSelf
      const msg = { ...message, isSelf: message.senderId === 'demo_user' };
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    return () => newSocket.disconnect();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;
    
    // Send to backend engine
    socket.emit('send_message', {
      conversationId,
      senderId: 'demo_user',
      body: input
    });
    
    setInput('');
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Sidebar: Chat List */}
      <div style={{ width: '320px', background: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b' }}>Messages</h2>
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', background: '#eff6ff', cursor: 'pointer' }}>
            <div style={{ fontWeight: 600, color: '#1e293b' }}>React Bootcamp (Batch A)</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>Teacher: It will be unlocked...</div>
          </div>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}>
            <div style={{ fontWeight: 600, color: '#1e293b' }}>Priya Patel</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>Did you finish the assignment?</div>
          </div>
        </div>
      </div>

      {/* Main Chat Window */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
        
        {/* Chat Header */}
        <div style={{ padding: '24px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: '#1e293b' }}>React Bootcamp (Batch A)</h2>
            <div style={{ fontSize: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
              32 Online
            </div>
          </div>
        </div>

        {/* Messages Feed */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: msg.isSelf ? 'flex-end' : 'flex-start' }}>
              <div style={{ 
                maxWidth: '60%', 
                padding: '12px 16px', 
                borderRadius: '16px', 
                borderTopRightRadius: msg.isSelf ? '4px' : '16px',
                borderTopLeftRadius: !msg.isSelf ? '4px' : '16px',
                background: msg.isSelf ? '#4f46e5' : 'white', 
                color: msg.isSelf ? 'white' : '#1e293b',
                border: msg.isSelf ? 'none' : '1px solid #e2e8f0',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                lineHeight: '1.5'
              }}>
                {!msg.isSelf && <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8b5cf6', marginBottom: '4px' }}>Instructor</div>}
                {msg.body}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '24px', background: 'white', borderTop: '1px solid #e2e8f0' }}>
          <form onSubmit={sendMessage} style={{ display: 'flex', gap: '16px' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              style={{ flex: 1, padding: '16px 24px', borderRadius: '30px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem' }}
            />
            <button type="submit" disabled={!input.trim()} style={{ background: input.trim() ? '#4f46e5' : '#cbd5e1', color: 'white', border: 'none', padding: '0 32px', borderRadius: '30px', fontWeight: 600, cursor: input.trim() ? 'pointer' : 'not-allowed', transition: 'background 0.2s' }}>
              Send
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ChatInterface;
