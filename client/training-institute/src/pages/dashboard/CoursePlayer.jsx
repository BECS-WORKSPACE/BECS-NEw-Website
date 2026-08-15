import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchCourseById, updateVideoProgress, getCourseProgress, getResumeData } from '../../api';
import api from '../../api'; // Default axios instance for custom fetching
import { DEFAULT_COURSES } from '../../data/courses';

import EnterpriseVideoPlayer from '../../components/player/EnterpriseVideoPlayer';
import TimestampNotesPanel from '../../components/player/TimestampNotesPanel';

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [curriculumTree, setCurriculumTree] = useState([]);
  
  // Player State
  const [activeLesson, setActiveLesson] = useState(null);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});
  const [expandedChapters, setExpandedChapters] = useState({});
  
  // Enterprise Engine State
  const [resumeTime, setResumeTime] = useState(0);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [activeTab, setActiveTab] = useState('curriculum'); // 'curriculum' or 'notes'
  
  const dummyVideo = "https://www.w3schools.com/html/mov_bbb.mp4";

  useEffect(() => {
    if (!user?.isPremium) {
      navigate('/dashboard/subscription');
      return;
    }

    const loadData = async () => {
      try {
        let currentCourse;
        try {
          currentCourse = await fetchCourseById(courseId);
        } catch(e) {
          currentCourse = DEFAULT_COURSES.find(c => String(c.id) === courseId || String(c._id) === courseId);
          currentCourse = { ...currentCourse, version: 'legacy' };
        }
        setCourse(currentCourse);

        if (currentCourse) {
          const progressRes = await getCourseProgress(courseId);
          if (progressRes) setProgressData(progressRes);
        }

        if (currentCourse?.version === 'v2' && currentCourse._id) {
          const treeRes = await api.get(`/curriculum/${currentCourse._id}`);
          setCurriculumTree(treeRes.data);
          
          if (treeRes.data.length > 0 && treeRes.data[0].chapters.length > 0 && treeRes.data[0].chapters[0].lessons.length > 0) {
            handleLessonChange(treeRes.data[0].chapters[0].lessons[0]);
            setExpandedModules({ [treeRes.data[0]._id]: true });
            setExpandedChapters({ [treeRes.data[0].chapters[0]._id]: true });
          }
        } else {
          handleLessonChange(0); // Legacy index
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [courseId, user, navigate]);

  const handleLessonChange = async (lessonIdentifier) => {
    setActiveLesson(lessonIdentifier);
    setResumeTime(0);
    setCurrentPlaybackTime(0);
    
    // If it's a V2 course, try to fetch resume time
    if (lessonIdentifier && typeof lessonIdentifier === 'object' && lessonIdentifier._id) {
      try {
        const resumeData = await getResumeData(lessonIdentifier._id);
        if (resumeData && resumeData.lastWatchedTimestamp > 0) {
          setResumeTime(resumeData.lastWatchedTimestamp);
        }
      } catch (err) {
        console.error('Failed to get resume time');
      }
    }
  };

  const handleVideoProgress = async (currentTime, duration) => {
    setCurrentPlaybackTime(currentTime);
    if (!course) return;
    
    const isCompleted = (currentTime / duration) > 0.9;
    
    try {
      const lessonIdentifier = course.version === 'v2' && activeLesson ? activeLesson._id : course.syllabus[activeLesson];
      
      await updateVideoProgress({
        courseId: course._id || course.id,
        lessonId: lessonIdentifier,
        currentTimestamp: Math.floor(currentTime),
        duration: Math.floor(duration), // V2 payload format
        watchTimeSeconds: Math.floor(currentTime), // Legacy fallback
        totalDurationSeconds: Math.floor(duration), // Legacy fallback
        isCompleted
      });
      
      if (isCompleted && !progressData.some(p => p.lesson === lessonIdentifier && p.isCompleted)) {
        setProgressData(prev => [
          ...prev.filter(p => p.lesson !== lessonIdentifier),
          { lesson: lessonIdentifier, isCompleted: true }
        ]);
      }
    } catch (err) {
      console.error('Failed to sync progress', err);
    }
  };

  const toggleModule = (id) => setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleChapter = (id) => setExpandedChapters(prev => ({ ...prev, [id]: !prev[id] }));

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '60vh' }}>
        <h3 style={{ color: 'var(--navy)' }}>Loading Enterprise Engine...</h3>
      </div>
    );
  }

  if (!course) return <div>Course not found</div>;

  const totalItems = course.version === 'v2' 
    ? curriculumTree.reduce((acc, mod) => acc + mod.chapters.reduce((cAcc, chap) => cAcc + chap.lessons.length, 0), 0)
    : course.syllabus?.length || 0;
  
  const completedCount = progressData.filter(p => p.isCompleted).length;
  const progressPct = totalItems > 0 ? (completedCount / totalItems) * 100 : 0;
  
  const isV2 = course.version === 'v2';

  return (
    <div style={{ display: 'flex', gap: '24px', height: 'calc(100vh - 100px)', paddingBottom: '20px' }}>
      
      {/* Video Player Section */}
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden' }}>
        <div style={{ borderRadius: '16px', overflow: 'hidden', flex: '1', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <EnterpriseVideoPlayer 
            videoUrl={activeLesson?.videoUrl || dummyVideo}
            lessonId={isV2 ? activeLesson?._id : activeLesson}
            initialTime={resumeTime}
            onProgress={handleVideoProgress}
          />
        </div>
        
        <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', flexShrink: 0 }}>
          <h2 style={{ margin: '0 0 12px 0', fontSize: '1.5rem', color: 'var(--navy)', fontFamily: 'Outfit', fontWeight: 700 }}>
            {isV2 ? activeLesson?.title : course.syllabus[activeLesson]}
          </h2>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ background: 'rgba(59,130,246,0.1)', color: '#2563eb', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
               {isV2 ? activeLesson?.type?.toUpperCase() : `Module ${activeLesson + 1}`}
            </span>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Instructor: {course.faculty || course.facultyName}</span>
          </div>
        </div>
      </div>

      {/* Right Sidebar (Tabs for Curriculum / Notes) */}
      <div style={{ width: '380px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: '#fff', borderRadius: '12px', padding: '6px', border: '1px solid #e2e8f0' }}>
          <button 
            onClick={() => setActiveTab('curriculum')}
            style={{ flex: 1, padding: '10px', background: activeTab === 'curriculum' ? '#f8fafc' : 'transparent', color: activeTab === 'curriculum' ? 'var(--navy)' : '#64748b', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
          >
            Curriculum
          </button>
          <button 
            onClick={() => setActiveTab('notes')}
            style={{ flex: 1, padding: '10px', background: activeTab === 'notes' ? '#f8fafc' : 'transparent', color: activeTab === 'notes' ? 'var(--navy)' : '#64748b', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
          >
            Notes
          </button>
        </div>

        {/* Dynamic Panel Content */}
        {activeTab === 'curriculum' ? (
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <div style={{ width: '100%', background: '#e2e8f0', height: '6px', borderRadius: '4px' }}>
                 <div style={{ width: `${progressPct}%`, background: '#10b981', height: '100%', borderRadius: '4px', transition: 'width 0.3s' }}></div>
              </div>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                {completedCount} / {totalItems} Items Completed
              </p>
            </div>
            
            <div style={{ overflowY: 'auto', flex: '1', padding: '12px' }}>
              {isV2 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {curriculumTree.map(mod => (
                    <div key={mod._id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                      <div onClick={() => toggleModule(mod._id)} style={{ padding: '12px 16px', background: expandedModules[mod._id] ? '#f1f5f9' : '#ffffff', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--navy)', fontWeight: 700 }}>{mod.title}</h4>
                        <span style={{ color: '#64748b' }}>{expandedModules[mod._id] ? '▲' : '▼'}</span>
                      </div>
                      
                      {expandedModules[mod._id] && (
                        <div style={{ padding: '8px', background: '#f8fafc' }}>
                          {mod.chapters.map(chap => (
                            <div key={chap._id} style={{ marginBottom: '8px', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                              <div onClick={() => toggleChapter(chap._id)} style={{ padding: '10px 12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', borderBottom: expandedChapters[chap._id] ? '1px solid #e2e8f0' : 'none' }}>
                                <h5 style={{ margin: 0, fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>{chap.title}</h5>
                                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{expandedChapters[chap._id] ? '▲' : '▼'}</span>
                              </div>
                              
                              {expandedChapters[chap._id] && (
                                <div style={{ padding: '8px' }}>
                                  {chap.lessons.map(les => {
                                    const isCompleted = progressData.some(p => p.lesson === les._id && p.isCompleted);
                                    const isActive = activeLesson?._id === les._id;
                                    
                                    return (
                                      <div 
                                        key={les._id} onClick={() => handleLessonChange(les)}
                                        style={{ 
                                          padding: '10px', borderRadius: '6px', cursor: 'pointer', marginBottom: '4px',
                                          display: 'flex', gap: '12px', alignItems: 'center',
                                          background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
                                          color: isActive ? '#1d4ed8' : '#475569'
                                        }}
                                      >
                                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: isCompleted ? '#10b981' : (isActive ? '#3b82f6' : '#cbd5e1'), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
                                          {isCompleted ? '✓' : '▶'}
                                        </div>
                                        <span style={{ fontSize: '0.85rem', fontWeight: isActive ? 600 : 500 }}>{les.title}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                course.syllabus?.map((lesson, idx) => {
                  const isCompleted = progressData.some(p => p.lesson === lesson && p.isCompleted);
                  const isActive = idx === activeLesson;
                  
                  return (
                    <div 
                      key={idx}
                      onClick={() => handleLessonChange(idx)}
                      style={{ 
                        padding: '16px', borderRadius: '12px', cursor: 'pointer', marginBottom: '8px',
                        display: 'flex', gap: '16px', alignItems: 'flex-start',
                        background: isActive ? 'rgba(59,130,246,0.05)' : 'transparent',
                        border: isActive ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
                        transition: 'background 0.2s'
                      }}
                    >
                      <div style={{ 
                        width: '24px', height: '24px', borderRadius: '50%', 
                        background: isCompleted ? '#10b981' : (isActive ? '#3b82f6' : '#e2e8f0'),
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.8rem', fontWeight: 700, flexShrink: 0
                      }}>
                        {isCompleted ? '✓' : (idx + 1)}
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', color: isActive ? '#1e40af' : 'var(--navy)', fontWeight: isActive ? 700 : 500 }}>
                          {lesson}
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>▶ Video</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          /* Notes Panel */
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <TimestampNotesPanel 
              lessonId={isV2 ? activeLesson?._id : activeLesson} 
              currentTimestamp={currentPlaybackTime} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePlayer;
