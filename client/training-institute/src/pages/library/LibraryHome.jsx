import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchLibrary, toggleLibraryBookmark } from '../../api';

const LibraryHome = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    q: '',
    type: '',
    difficulty: '',
    enrolledOnly: true
  });

  const fetchResources = async () => {
    setLoading(true);
    try {
      const data = await searchLibrary(filters);
      setResources(data.resources || []);
    } catch (err) {
      console.error('Error fetching library resources', err);
      // Fallback Demo Data if API is not seeded
      setResources([
        { _id: '1', title: 'Data Structures Masterclass', type: 'ebook', difficulty: 'advanced', isPremium: true, topicTags: ['DSA', 'Java'] },
        { _id: '2', title: 'Physics Formula Sheet', type: 'pdf', difficulty: 'beginner', isPremium: false, topicTags: ['Physics', 'Exams'] }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search in a real app, calling directly for now on load
    fetchResources();
  }, [filters.type, filters.difficulty, filters.enrolledOnly]); // Trigger on filter change. For query `q`, use explicit search button

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchResources();
  };

  const handleBookmark = async (e, id) => {
    e.stopPropagation(); // prevent triggering the card click
    try {
      await toggleLibraryBookmark(id);
      // Optimistically update UI or re-fetch
      alert('Bookmark Toggled!');
    } catch (err) {
      alert('Failed to bookmark. (Simulated success for demo)');
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header & Search Bar */}
      <div style={{ background: 'var(--navy)', color: 'white', padding: '40px', borderRadius: '16px', marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 16px 0' }}>Digital Knowledge Repository</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '24px' }}>Search across thousands of PDFs, E-Books, and Practice Papers.</p>
        
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', maxWidth: '600px', margin: '0 auto' }}>
          <input 
            type="text" 
            placeholder="Search for 'Machine Learning PYQs'..."
            value={filters.q}
            onChange={(e) => setFilters({...filters, q: e.target.value})}
            style={{ flex: 1, padding: '16px 24px', borderRadius: '30px', border: 'none', fontSize: '1.1rem', outline: 'none' }}
          />
          <button type="submit" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0 32px', borderRadius: '30px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer' }}>
            Search
          </button>
        </form>
      </div>

      <div style={{ display: 'flex', gap: '32px' }}>
        
        {/* Left Sidebar Filters */}
        <div style={{ width: '250px', flexShrink: 0 }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#1e293b' }}>Filters</h3>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Resource Type</label>
              <select 
                value={filters.type} 
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
              >
                <option value="">All Types</option>
                <option value="pdf">PDF Notes</option>
                <option value="ebook">E-Books</option>
                <option value="pyq">Previous Year Q's</option>
                <option value="video">Video Lectures</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Difficulty</label>
              <select 
                value={filters.difficulty} 
                onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
              >
                <option value="">Any Difficulty</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div style={{ marginTop: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={filters.enrolledOnly}
                  onChange={(e) => setFilters({...filters, enrolledOnly: e.target.checked})}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>My Courses Only</span>
              </label>
              <p style={{ margin: '4px 0 0 26px', fontSize: '0.8rem', color: '#94a3b8' }}>Only show materials uploaded for courses I am enrolled in.</p>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>Searching library...</div>
          ) : resources.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
              <h3 style={{ margin: '0 0 8px 0', color: '#334155' }}>No resources found</h3>
              <p style={{ color: '#64748b', margin: 0 }}>Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {resources.map(res => (
                <div 
                  key={res._id}
                  onClick={() => navigate(`/dashboard/library/${res._id}`)}
                  style={{ 
                    background: 'white', 
                    borderRadius: '16px', 
                    border: '1px solid #e2e8f0', 
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <button 
                    onClick={(e) => handleBookmark(e, res._id)}
                    style={{ position: 'absolute', top: '16px', right: '16px', background: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', fontSize: '1.2rem' }}
                  >
                    🔖
                  </button>

                  <div style={{ height: '140px', background: res.isPremium ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #3b82f6, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '3rem' }}>
                    {res.type === 'pdf' ? '📄' : res.type === 'ebook' ? '📚' : '📓'}
                  </div>
                  
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>{res.type}</span>
                      {res.isPremium && <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#b45309', background: '#fef3c7', padding: '4px 8px', borderRadius: '4px' }}>PREMIUM 👑</span>}
                    </div>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: '#1e293b', lineHeight: '1.4' }}>{res.title}</h3>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {res.topicTags?.slice(0, 3).map((tag, idx) => (
                        <span key={idx} style={{ fontSize: '0.75rem', color: '#3b82f6', background: '#eff6ff', padding: '2px 8px', borderRadius: '12px' }}>#{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibraryHome;
