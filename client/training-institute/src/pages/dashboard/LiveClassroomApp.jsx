import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { io } from 'socket.io-client';

const LiveClassroomApp = () => {
  const { classId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);
  const socketRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [doubts, setDoubts] = useState([]);
  const [doubtText, setDoubtText] = useState('');
  const [showDoubts, setShowDoubts] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Connect to the Live socket namespace
    // Assuming backend is at process.env.VITE_API_URL or defaults to localhost:5000
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const socketUrl = API_URL.replace('/api', '/live');
    
    // Get token from localStorage
    let token = '';
    const savedUser = localStorage.getItem('becs_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        token = parsed.token;
      } catch (e) {
        console.error('Failed to parse user', e);
      }
    }

    socketRef.current = io(socketUrl, {
      auth: { token }
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('Socket connection failed', err);
      // We don't block the video if socket fails, but attendance tracking won't work
    });

    socketRef.current.on('CLASS_ENDED', () => {
      alert('The instructor has ended the class.');
      navigate('/dashboard/live-classes');
    });

    // Simulate an API call to validate if user can join and get secure token/room name
    const validateAndInitialize = async () => {
      try {
        await new Promise(r => setTimeout(r, 800));
        
        if (!window.JitsiMeetExternalAPI) {
          const script = document.createElement('script');
          script.src = 'https://8x8.vc/external_api.js';
          script.async = true;
          script.onload = () => initializeJitsi();
          document.body.appendChild(script);
        } else {
          initializeJitsi();
        }
      } catch (err) {
        setError('Failed to securely authenticate live session.');
        setLoading(false);
      }
    };

    validateAndInitialize();

    return () => {
      // Cleanup
      if (socketRef.current) {
        socketRef.current.emit('LEAVE_CLASS', { classId });
        socketRef.current.disconnect();
      }
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
      }
    };
  }, [classId, user, navigate]);

  const handleAskDoubt = (e) => {
    e.preventDefault();
    if (!doubtText.trim()) return;
    socketRef.current?.emit('ASK_DOUBT', { classId, question: doubtText });
    setDoubtText('');
  };

  const handleResolveDoubt = (doubtId) => {
    socketRef.current?.emit('RESOLVE_DOUBT', { classId, doubtId });
  };

  const handleEndClass = () => {
    if (window.confirm("Are you sure you want to end this class for everyone?")) {
      socketRef.current?.emit('END_CLASS', { classId });
      navigate('/dashboard/live-classes');
    }
  };

  const initializeJitsi = () => {
    const isTeacher = user.isAdmin || user.role?.name === 'Teacher' || user.legacyRole === 'teacher';
    const publicDomain = 'meet.jit.si';
    const roomName = `EduVerse_Enterprise_Class_${classId}_${import.meta.env.MODE || 'dev'}`;

    const options = {
      roomName,
      width: '100%',
      height: '100%',
      parentNode: jitsiContainerRef.current,
      configOverwrite: {
        disableDeepLinking: true,
        prejoinPageEnabled: false,
        startWithAudioMuted: !isTeacher,
        startWithVideoMuted: !isTeacher,
        enableNoAudioDetection: true,
        enableNoisyMicDetection: true,
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: isTeacher 
          ? [
              'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
              'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
              'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
              'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
              'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone', 'security'
            ]
          : [
              'microphone', 'camera', 'desktop', 'fullscreen', 'hangup', 
              'profile', 'chat', 'raisehand', 'videoquality', 'tileview'
            ],
        SETTINGS_SECTIONS: ['devices', 'language', 'profile'],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
      },
      userInfo: {
        displayName: user.name,
        email: user.email
      }
    };

    try {
      const api = new window.JitsiMeetExternalAPI(publicDomain, options);
      jitsiApiRef.current = api;

      api.addListener('videoConferenceJoined', () => {
        setIsJoined(true);
        setLoading(false);
        // Emit Socket event to track accurate Join Time
        socketRef.current?.emit('JOIN_CLASS', { classId });
      });

      api.addListener('videoConferenceLeft', () => {
        socketRef.current?.emit('LEAVE_CLASS', { classId });
        navigate('/dashboard/live-classes');
      });
      
    } catch (err) {
      console.error('Jitsi initialization failed:', err);
      setError('Failed to initialize streaming engines.');
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', background: 'white', borderRadius: '24px' }}>
        <h2>❌ Connection Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/dashboard/live-classes')}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ padding: '16px 24px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => navigate('/dashboard/live-classes')}
            style={{ padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
          >
            ← Leave
          </button>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--navy)' }}>Live Session: {classId}</h2>
        </div>
        
        {loading && <span style={{ color: '#ef4444', fontWeight: 600, animation: 'pulse 1.5s infinite' }}>Connecting securely...</span>}
        {isJoined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '50%' }}></span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Connected (Encrypted)</span>
            </div>
            
            {!showDoubts && isJoined && (
              <button 
                onClick={() => setShowDoubts(true)}
                style={{ padding: '8px 16px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, marginRight: '16px' }}
              >
                Show Q&A
              </button>
            )}
            {(user.isAdmin || user.role?.name === 'Teacher' || user.legacyRole === 'teacher') && (
              <button 
                onClick={handleEndClass}
                style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
              >
                End Class
              </button>
            )}
          </div>
        )}
      </div>

      <div style={{ flex: 1, position: 'relative', background: '#0f172a', display: 'flex' }}>
        <div style={{ flex: showDoubts ? 3 : 1, position: 'relative', transition: 'all 0.3s' }}>
          <div ref={jitsiContainerRef} style={{ width: '100%', height: '100%' }} />
        </div>
        
        {showDoubts && isJoined && (
          <div style={{ flex: 1, minWidth: '300px', maxWidth: '400px', background: 'white', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #e2e8f0' }}>
            <div style={{ padding: '16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--navy)' }}>Real-time Q&A</h3>
              <button onClick={() => setShowDoubts(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {doubts.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '40px' }}>No doubts asked yet.</div>
              ) : (
                doubts.map(d => (
                  <div key={d._id} style={{ background: d.isResolved ? '#f0fdf4' : '#f8fafc', padding: '12px', borderRadius: '8px', border: `1px solid ${d.isResolved ? '#bbf7d0' : '#e2e8f0'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)' }}>{d.studentName}</span>
                      {d.isResolved && <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>✓ Resolved</span>}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#334155' }}>{d.question}</p>
                    
                    {!d.isResolved && (user.isAdmin || user.role?.name === 'Teacher' || user.legacyRole === 'teacher') && (
                      <button 
                        onClick={() => handleResolveDoubt(d._id)}
                        style={{ marginTop: '8px', padding: '4px 8px', fontSize: '0.8rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {(!user.isAdmin && user.role?.name !== 'Teacher' && user.legacyRole !== 'teacher') && (
              <form onSubmit={handleAskDoubt} style={{ padding: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  value={doubtText}
                  onChange={e => setDoubtText(e.target.value)}
                  placeholder="Ask a doubt..." 
                  style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                />
                <button type="submit" style={{ padding: '10px 16px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Send</button>
              </form>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default LiveClassroomApp;
