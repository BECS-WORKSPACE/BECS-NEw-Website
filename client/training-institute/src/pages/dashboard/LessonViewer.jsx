import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LessonViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [lesson, setLesson] = useState(null);
  const [resumeFrom, setResumeFrom] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastSavedTime, setLastSavedTime] = useState(0);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/lms/lesson/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.data.success) {
          setLesson(res.data.lesson);
          setResumeFrom(res.data.resumeFromSeconds);
        }
      } catch (err) {
        console.error("Error fetching lesson:", err);
        setError(err.response?.data?.message || 'Failed to load lesson. Access denied.');
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [id]);

  useEffect(() => {
    if (videoRef.current && resumeFrom > 0) {
      videoRef.current.currentTime = resumeFrom;
    }
  }, [lesson, resumeFrom]);

  const saveProgress = async (currentTime, isCompleted = false) => {
    // Throttle saves to every 10 seconds unless completing
    if (!isCompleted && Math.abs(currentTime - lastSavedTime) < 10) return;
    
    setLastSavedTime(currentTime);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/lms/lesson/${id}/progress`, {
        watchedSeconds: currentTime,
        isCompleted
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    } catch (err) {
      console.error("Error saving progress:", err);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      saveProgress(videoRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    if (videoRef.current) {
      saveProgress(videoRef.current.currentTime, true);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading lesson...</div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error}</div>;
  if (!lesson) return null;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <button onClick={() => navigate(`/dashboard/course/${lesson.course._id}`)} style={{ background: 'transparent', border: '1px solid #cbd5e1', color: '#475569', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', marginBottom: '16px' }}>
        ← Back to Syllabus
      </button>

      <div style={{ background: 'black', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {lesson.type === 'video' ? (
          lesson.videoUrl ? (
            <video 
              ref={videoRef}
              src={lesson.videoUrl} 
              controls 
              style={{ width: '100%', height: '100%' }}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
            />
          ) : (
            <div style={{ color: 'white' }}>Video content coming soon...</div>
          )
        ) : (
          <div style={{ color: 'white', padding: '40px', textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 16px 0' }}>{lesson.title}</h2>
            <p>This is a {lesson.type} resource. Please check attachments.</p>
            <button onClick={() => saveProgress(1, true)} style={{ marginTop: '16px', padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Mark as Completed
            </button>
          </div>
        )}
      </div>

      <div style={{ background: 'white', borderRadius: '16px', padding: '32px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {lesson.course?.title}
            </span>
            <h1 style={{ fontSize: '2rem', margin: '8px 0', color: '#1e293b' }}>{lesson.title}</h1>
            <p style={{ margin: 0, color: '#64748b', lineHeight: 1.6 }}>{lesson.description || 'No description provided.'}</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px', display: 'flex', gap: '16px' }}>
          <button onClick={() => navigate('/dashboard/questions')} style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            Practice Questions
          </button>
          <button onClick={() => navigate('/dashboard/doubts')} style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            Ask a Doubt
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;
