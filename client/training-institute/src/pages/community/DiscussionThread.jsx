import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DiscussionThread = () => {
  const { discussionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Mock data for UI representation
  const thread = {
    title: 'How does React Virtual DOM work under the hood?',
    body: 'I understand that React is fast because it uses a virtual DOM, but what actually is it? Is it just a JavaScript object? How does the diffing algorithm decide what to update on the real browser DOM? Any visual examples would be appreciated!',
    author: 'Rahul Sharma',
    createdAt: new Date().toISOString(),
    status: 'resolved',
    tags: ['React', 'Advanced', 'Architecture'],
    replies: [
      {
        id: 'r1',
        author: 'Sarah Jenkins (Instructor)',
        isTeacher: true,
        body: 'Great question Rahul! Yes, the Virtual DOM is essentially a lightweight, in-memory JavaScript representation of the actual DOM.\n\nWhen state changes, React creates a new Virtual DOM tree. It then compares (diffs) this new tree with the previous Virtual DOM tree. It calculates the minimum number of operations required to update the REAL DOM, and then batches those updates.\n\nThis is much faster than manipulating the real DOM directly for every single state change!',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        isBestAnswer: true
      },
      {
        id: 'r2',
        author: 'Amit Kumar',
        isTeacher: false,
        body: 'Just to add to what Sarah said, React uses a heuristic algorithm with O(n) complexity based on two assumptions: 1. Two elements of different types will produce different trees. 2. You can hint at which child elements may be stable across different renders with a "key" prop.',
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        isBestAnswer: false
      }
    ]
  };

  useEffect(() => {
    // Simulate API fetch delay
    setTimeout(() => setLoading(false), 500);
  }, [discussionId]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading thread...</div>;

  return (
    <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      <button onClick={() => navigate('/dashboard/discussions')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '24px', fontWeight: 600 }}>
        ⬅️ Back to Forum
      </button>

      {/* Main Question */}
      <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
        <h1 style={{ margin: '0 0 16px 0', fontSize: '2rem', color: '#0f172a' }}>{thread.title}</h1>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
            {thread.author[0]}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#1e293b' }}>{thread.author}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Asked on {new Date(thread.createdAt).toLocaleDateString()}</div>
          </div>
        </div>

        <div style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#334155', whiteSpace: 'pre-wrap' }}>
          {thread.body}
        </div>
      </div>

      {/* Replies */}
      <h3 style={{ marginBottom: '24px', color: '#1e293b' }}>{thread.replies.length} Replies</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {thread.replies.map(reply => (
          <div key={reply.id} style={{ background: reply.isBestAnswer ? '#f0fdf4' : 'white', padding: '24px', borderRadius: '16px', border: reply.isBestAnswer ? '2px solid #22c55e' : '1px solid #e2e8f0', position: 'relative' }}>
            
            {reply.isBestAnswer && (
              <div style={{ position: 'absolute', top: '-12px', left: '24px', background: '#22c55e', color: 'white', padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 700 }}>
                ⭐ BEST ANSWER
              </div>
            )}

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: reply.isTeacher ? '#8b5cf6' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                {reply.author[0]}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {reply.author}
                  {reply.isTeacher && <span style={{ background: '#ede9fe', color: '#7c3aed', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>INSTRUCTOR</span>}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(reply.createdAt).toLocaleDateString()}</div>
              </div>
            </div>

            <div style={{ fontSize: '1rem', lineHeight: '1.6', color: '#334155', whiteSpace: 'pre-wrap' }}>
              {reply.body}
            </div>
          </div>
        ))}
      </div>

      {/* Reply Input */}
      <div style={{ marginTop: '32px', background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>Post a Reply</h4>
        <textarea 
          placeholder="Share your insights..."
          style={{ width: '100%', minHeight: '120px', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical', boxSizing: 'border-box', marginBottom: '16px', fontFamily: 'inherit' }}
        />
        <button style={{ background: '#0f172a', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          Submit Reply
        </button>
      </div>

    </div>
  );
};

export default DiscussionThread;
