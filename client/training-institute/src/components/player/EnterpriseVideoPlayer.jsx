import React, { useRef, useState, useEffect } from 'react';

const EnterpriseVideoPlayer = ({ videoUrl, lessonId, onProgress, initialTime = 0, onEnded }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  let controlsTimeout = null;

  useEffect(() => {
    // Jump to initial time if provided (Resume Playback Feature)
    if (videoRef.current && initialTime > 0) {
      videoRef.current.currentTime = initialTime;
    }
  }, [initialTime, lessonId]);

  const handlePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const time = videoRef.current.currentTime;
    setCurrentTime(time);
    
    // Beacon sync every 5 seconds
    if (Math.floor(time) % 5 === 0 && Math.floor(time) > 0) {
      onProgress(time, videoRef.current.duration);
    }
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handlePlaybackRateChange = () => {
    const rates = [0.5, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    
    videoRef.current.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.error(err));
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const togglePiP = async () => {
    try {
      if (videoRef.current !== document.pictureInPictureElement) {
        await videoRef.current.requestPictureInPicture();
      } else {
        await document.exitPictureInPicture();
      }
    } catch (error) {
      console.error('PiP failed', error);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout) clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2500);
  };

  const formatTime = (timeInSeconds) => {
    const m = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const s = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Expose seeking capability externally (e.g., clicking a note)
  useEffect(() => {
    const handleExternalSeek = (e) => {
      if (e.detail && e.detail.lessonId === lessonId) {
        videoRef.current.currentTime = e.detail.timestamp;
        videoRef.current.play();
        setIsPlaying(true);
      }
    };
    window.addEventListener('SEEK_VIDEO', handleExternalSeek);
    return () => window.removeEventListener('SEEK_VIDEO', handleExternalSeek);
  }, [lessonId]);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      style={{
        position: 'relative', width: '100%', height: '100%', background: '#000',
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onEnded}
        onClick={handlePlayPause}
        style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'pointer' }}
      />
      
      {/* Custom Controls Overlay */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, 
        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
        padding: '20px', transition: 'opacity 0.3s',
        opacity: showControls ? 1 : 0, pointerEvents: showControls ? 'auto' : 'none',
        display: 'flex', flexDirection: 'column', gap: '12px'
      }}>
        
        {/* Progress Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: 'white', fontSize: '0.85rem', fontFamily: 'monospace' }}>{formatTime(currentTime)}</span>
          <input 
            type="range" min="0" max={duration || 100} value={currentTime}
            onChange={handleSeek}
            style={{ flex: 1, cursor: 'pointer', accentColor: '#3b82f6' }}
          />
          <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontFamily: 'monospace' }}>{formatTime(duration)}</span>
        </div>
        
        {/* Bottom Controls Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={handlePlayPause} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer', padding: 0 }}>
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button onClick={handlePlaybackRateChange} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}>
              {playbackRate}x
            </button>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
             <button onClick={togglePiP} title="Picture in Picture" style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.1rem', cursor: 'pointer', padding: 0 }}>
              🔲
            </button>
            <button onClick={toggleFullScreen} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.1rem', cursor: 'pointer', padding: 0 }}>
              {isFullScreen ? '↙' : '↗'}
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default EnterpriseVideoPlayer;
