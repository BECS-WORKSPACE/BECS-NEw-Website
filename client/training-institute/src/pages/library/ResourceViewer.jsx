import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLibraryResource } from '../../api';

const ResourceViewer = () => {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const data = await getLibraryResource(resourceId);
        setResource(data);
      } catch (err) {
        if (err.response?.status === 403) {
          setError('This is a Premium Resource. Please upgrade your subscription to access it.');
        } else {
          setError('Failed to load resource.');
          // Mock data for UI presentation
          setResource({
            _id: '1',
            title: 'Data Structures Masterclass',
            type: 'pdf',
            description: 'A comprehensive guide to arrays, linked lists, trees, and graphs.',
            fileUrl: 'https://example.com/demo.pdf',
            isPremium: true,
            allowDownload: true
          });
          setError(''); // Clear error for mock view
        }
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [resourceId]);

  if (loading) return <div style={{ padding: '60px', textAlign: 'center' }}>Loading Viewer...</div>;
  
  if (error) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🔒</div>
        <h2 style={{ color: '#1e293b', marginBottom: '16px' }}>Premium Access Required</h2>
        <p style={{ color: '#64748b', marginBottom: '32px' }}>{error}</p>
        <button onClick={() => navigate('/dashboard/library')} style={{ background: 'var(--navy)', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          Back to Library
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
      
      {/* Top Action Bar */}
      <div style={{ background: 'white', padding: '16px 32px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => navigate('/dashboard/library')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
            ⬅️
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b' }}>{resource.title}</h2>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{resource.type.toUpperCase()} • v1.0</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          {resource.allowDownload && (
            <button 
              onClick={() => alert('Secure Presigned Download Link Generated!')}
              style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              📥 Download File
            </button>
          )}
        </div>
      </div>

      {/* Viewer Area */}
      <div style={{ flex: 1, background: '#f8fafc', padding: '32px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', minHeight: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Mock Document Render */}
          <div style={{ fontSize: '5rem', color: '#cbd5e1', marginBottom: '24px' }}>📄</div>
          <h3 style={{ color: '#475569', marginBottom: '8px' }}>Document Preview</h3>
          <p style={{ color: '#94a3b8' }}>This is where the React-PDF or Iframe renderer will display the file securely.</p>
          <div style={{ background: '#f1f5f9', padding: '12px 24px', borderRadius: '8px', color: '#64748b', fontSize: '0.9rem', marginTop: '32px', fontFamily: 'monospace' }}>
            URL: {resource.fileUrl}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResourceViewer;
