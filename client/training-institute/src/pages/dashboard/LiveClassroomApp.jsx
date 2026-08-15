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

  useEffect(() => {
    if (!user) return;

    // Connect to the Live socket namespace
    // Assuming backend is at process.env.VITE_API_URL or defaults to localhost:5000
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const socketUrl = API_URL.replace('/api', '/live');
    
    // Get token from localStorage assuming authContext uses it or just pull it
    const token = localStorage.getItem('token') || (user.token); // Adjust based on your Auth context

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

      <div style={{ flex: 1, position: 'relative', background: '#0f172a' }}>
        <div ref={jitsiContainerRef} style={{ width: '100%', height: '100%' }} />
      </div>

    </div>
  );
};

export default LiveClassroomApp;
