import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDiscussions } from '../../api';

const DoubtForum = () => {
  const navigate = useNavigate();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const data = await getDiscussions();
        setDiscussions(data || []);
      } catch (err) {
        // Fallback Demo Data
        setDiscussions([
          { _id: '1', title: 'How does React Virtual DOM work under the hood?', authorId: { name: 'Rahul Sharma' }, status: 'resolved', viewCount: 142, topicTags: ['React', 'Advanced'] },
          { _id: '2', title: 'Help! Mongoose CastError when parsing ObjectIds', authorId: { name: 'Priya Patel' }, status: 'open', viewCount: 38, topicTags: ['MongoDB', 'Backend'] }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchDiscussions();
  }, []);

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 8px 0', color: '#1e293b' }}>Community Forum</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Ask questions, share knowledge, and collaborate.</p>
        </div>
        <button style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          + Ask a Question
        </button>
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        
        {/* Main Feed */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>Loading discussions...</div>
          ) : (
            discussions.map(discussion => (
              <div 
                key={discussion._id} 
                onClick={() => navigate(`/dashboard/discussions/${discussion._id}`)}
                style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  
                  <div>
                    <h3 style={{ margin: '0 0 12px 0', color: '#0f172a', fontSize: '1.25rem' }}>{discussion.title}</h3>
                    
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '0.9rem', color: '#64748b', marginBottom: '16px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#cbd5e1' }}></div>
                        {discussion.authorId?.name || 'Student'}
                      </span>
                      <span>•</span>
                      <span>{discussion.viewCount} Views</span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {discussion.topicTags?.map((tag, idx) => (
                        <span key={idx} style={{ background: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 500 }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    {discussion.status === 'resolved' ? (
                      <span style={{ background: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>✅ Solved</span>
                    ) : (
                      <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>🔥 Needs Help</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div style={{ width: '300px', flexShrink: 0 }}>
          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>Top Tags</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ background: 'white', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>React (142)</span>
              <span style={{ background: 'white', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>MongoDB (89)</span>
              <span style={{ background: 'white', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>CSS (45)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DoubtForum;
