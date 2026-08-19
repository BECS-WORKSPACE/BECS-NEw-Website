import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const MyCourses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [viewMode, setViewMode] = useState('grid');
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dbCourses, setDbCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');
        const data = res.data?.courses || res.data || [];
        setDbCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Fetch enrolled courses and attach dummy progress data
  const enrolledRaw = user.enrolledCourses ? dbCourses.filter(c => user.enrolledCourses.includes(String(c.id || c._id))) : [];
  
  const userCourses = enrolledRaw.map(c => ({
    ...c,
    progress: Math.floor(Math.random() * 100),
    lastAccessed: '2 days ago',
    chaptersCompleted: Math.floor(Math.random() * 10),
    totalChapters: 12,
    isFavorite: Math.random() > 0.5
  }));

  // Filtering
  const filteredCourses = userCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    
    if (filter === 'In Progress') return course.progress > 0 && course.progress < 100;
    if (filter === 'Completed') return course.progress === 100;
    if (filter === 'Favorites') return course.isFavorite;
    return true;
  });

  if (loading) {
    return (
      <div className="animate-fade-in" style={{ display: 'grid', placeItems: 'center', minHeight: '500px' }}>
        <p style={{ color: '#64748b' }}>Loading your courses...</p>
      </div>
    );
  }

  if (userCourses.length === 0) {
    return (
      <div className="animate-fade-in" style={{ display: 'grid', placeItems: 'center', minHeight: '500px', background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '5rem', marginBottom: '20px' }}>📚</div>
          <h3 style={{ fontSize: '1.8rem', color: 'var(--navy)', marginBottom: '12px', fontWeight: 700 }}>No Active Courses</h3>
          <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '1.1rem' }}>Explore our flagship programs and enroll today!</p>
          <button className="btn-solid-lg" onClick={() => navigate('/#courses')} style={{ padding: '16px 40px', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Browse Courses</button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontFamily: 'Outfit', color: 'var(--navy)', marginBottom: '8px', fontWeight: 700 }}>My Learning Hub</h2>
          <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>Track your progress and pick up right where you left off.</p>
        </div>

        {/* Toolbar: Search & Views */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Search my courses..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', width: '250px', outline: 'none' }}
          />
          <div style={{ display: 'flex', background: '#f8fafc', padding: '4px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <button onClick={() => setViewMode('grid')} style={{ padding: '8px 12px', border: 'none', background: viewMode === 'grid' ? '#ffffff' : 'transparent', borderRadius: '8px', cursor: 'pointer', boxShadow: viewMode === 'grid' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', color: viewMode === 'grid' ? 'var(--primary)' : '#64748b' }}>
              Grid
            </button>
            <button onClick={() => setViewMode('list')} style={{ padding: '8px 12px', border: 'none', background: viewMode === 'list' ? '#ffffff' : 'transparent', borderRadius: '8px', cursor: 'pointer', boxShadow: viewMode === 'list' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', color: viewMode === 'list' ? 'var(--primary)' : '#64748b' }}>
              List
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '10px' }}>
        {['All', 'In Progress', 'Completed', 'Favorites'].map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)}
            style={{ 
              padding: '10px 20px', borderRadius: '20px', border: 'none', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
              background: filter === f ? 'var(--primary)' : '#f8fafc',
              color: filter === f ? 'white' : '#475569',
              boxShadow: filter === f ? '0 4px 12px rgba(37,99,235,0.2)' : 'none'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Courses Grid / List */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(340px, 1fr))' : '1fr', 
        gap: '24px' 
      }}>
        {filteredCourses.map(course => (
          <div key={course.id || course._id} style={{ 
            background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', 
            flexDirection: viewMode === 'grid' ? 'column' : 'row',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}>
            <div style={{ 
              height: viewMode === 'grid' ? '180px' : 'auto', 
              width: viewMode === 'grid' ? '100%' : '250px',
              background: 'linear-gradient(135deg, #1e293b, #0f172a)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '4rem', position: 'relative' 
            }}>
              {course.title.includes('Code') || course.title.includes('Data') ? '💻' : '📘'}
              <button style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
                {course.isFavorite ? '❤️' : '🤍'}
              </button>
            </div>
            
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--navy)', margin: 0, fontWeight: 700, lineHeight: 1.3 }}>{course.title}</h3>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px', flex: 1 }}>
                Last accessed: {course.lastAccessed}
              </p>
              
              <div style={{ marginBottom: '24px', background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#475569', marginBottom: '8px', fontWeight: 600 }}>
                  <span>Chapter {course.chaptersCompleted}/{course.totalChapters}</span>
                  <span style={{ color: '#2563eb' }}>{course.progress}%</span>
                </div>
                <div style={{ width: '100%', background: '#e2e8f0', height: '8px', borderRadius: '4px' }}>
                  <div style={{ width: `${course.progress}%`, background: course.progress === 100 ? '#10b981' : 'linear-gradient(90deg, #3b82f6, #60a5fa)', height: '100%', borderRadius: '4px' }}></div>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  if (!user.isPremium) {
                    navigate('/dashboard/subscription');
                  } else {
                    navigate(`/dashboard/learn/${course.id || course._id}`);
                  }
                }} 
                style={{ 
                  width: '100%', padding: '14px', borderRadius: '12px', 
                  background: course.progress === 100 ? '#f8fafc' : 'var(--primary)', 
                  color: course.progress === 100 ? 'var(--navy)' : 'white', 
                  border: course.progress === 100 ? '1px solid #cbd5e1' : 'none', 
                  fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
                }}
              >
                {!user.isPremium ? 'Purchase Premium to Unlock 🔒' : (course.progress === 100 ? 'Review Course' : course.progress > 0 ? 'Resume Learning ▷' : 'Start Course ▷')}
              </button>
            </div>
          </div>
        ))}

        {filteredCourses.length === 0 && (
           <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', background: '#fff', borderRadius: '24px', border: '1px dashed #cbd5e1' }}>
             <h3 style={{ color: '#64748b' }}>No courses match your criteria.</h3>
           </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
