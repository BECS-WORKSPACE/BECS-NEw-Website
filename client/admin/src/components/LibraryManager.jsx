import React, { useState, useEffect } from 'react';
import api from '../api';

const LibraryManager = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  // Upload Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'pdf',
    difficulty: 'beginner',
    isPremium: false,
    topicTags: '',
    fileUrl: '' // In real app, this would be an actual file input mapped to S3
  });

  useEffect(() => {
    // Fetch existing resources to manage
    const fetchResources = async () => {
      try {
        const res = await api.get('/library/search?limit=50');
        setResources(res.data.resources || []);
      } catch (err) {
        console.error('Failed to load library resources', err);
        // Fallback demo data
        setResources([
          { _id: '1', title: 'Data Structures Masterclass', type: 'ebook', viewCount: 1420, downloadCount: 300, isPremium: true, version: '2.1' },
          { _id: '2', title: 'Physics Formula Sheet', type: 'pdf', viewCount: 890, downloadCount: 540, isPremium: false, version: '1.0' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      // Convert comma-separated string to array
      const payload = {
        ...formData,
        topicTags: formData.topicTags.split(',').map(t => t.trim()).filter(Boolean),
        fileUrl: formData.fileUrl || 'https://example.com/demo.pdf' // Fallback for demo
      };
      
      await api.post('/library', payload);
      alert('Resource Published Successfully!');
      setFormData({ ...formData, title: '', description: '', topicTags: '', fileUrl: '' });
      // Refresh list in real app
    } catch (err) {
      alert('Failed to publish resource.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ padding: '32px', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: '#1e293b' }}>Library Manager</h1>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Upload new resources or manage existing study materials.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '32px' }}>
        
        {/* Upload Panel */}
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 24px 0', color: '#0f172a' }}>Upload New Resource</h3>
          
          <form onSubmit={handleUpload}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Resource Title</label>
              <input required type="text" name="title" value={formData.title} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Resource Type</label>
              <select name="type" value={formData.type} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                <option value="pdf">PDF Document</option>
                <option value="ebook">E-Book</option>
                <option value="notes">Notes</option>
                <option value="slides">Slides/PPT</option>
                <option value="pyq">PYQ</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>File URL / Upload</label>
              <input type="text" name="fileUrl" value={formData.fileUrl} onChange={handleChange} placeholder="https://..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>* In Phase 5, this will be an S3 drag-and-drop</div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Tags (comma separated)</label>
              <input type="text" name="topicTags" value={formData.topicTags} onChange={handleChange} placeholder="AI, Machine Learning, Exam..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '24px', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, color: '#b45309' }}>
                <input type="checkbox" name="isPremium" checked={formData.isPremium} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                Premium Resource 👑
              </label>
            </div>

            <button type="submit" disabled={isUploading} style={{ width: '100%', background: '#4f46e5', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
              {isUploading ? 'Uploading...' : 'Publish to Library'}
            </button>
          </form>
        </div>

        {/* Management Dashboard */}
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ background: '#f8fafc', padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, color: '#0f172a' }}>Active Library Resources</h3>
          </div>
          
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>Loading resources...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.9rem' }}>
                  <th style={{ padding: '12px 24px', borderBottom: '1px solid #e2e8f0' }}>Resource Name</th>
                  <th style={{ padding: '12px 24px', borderBottom: '1px solid #e2e8f0' }}>Type</th>
                  <th style={{ padding: '12px 24px', borderBottom: '1px solid #e2e8f0' }}>Access</th>
                  <th style={{ padding: '12px 24px', borderBottom: '1px solid #e2e8f0' }}>Views</th>
                  <th style={{ padding: '12px 24px', borderBottom: '1px solid #e2e8f0' }}>Downloads</th>
                  <th style={{ padding: '12px 24px', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.map(res => (
                  <tr key={res._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{res.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>v{res.version}</div>
                    </td>
                    <td style={{ padding: '16px 24px', color: '#4f46e5', fontWeight: 600 }}>{res.type.toUpperCase()}</td>
                    <td style={{ padding: '16px 24px' }}>
                      {res.isPremium ? <span style={{ color: '#d97706', background: '#fef3c7', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>Premium</span> : <span style={{ color: '#16a34a', background: '#dcfce7', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>Free</span>}
                    </td>
                    <td style={{ padding: '16px 24px', color: '#475569' }}>{res.viewCount}</td>
                    <td style={{ padding: '16px 24px', color: '#475569' }}>{res.downloadCount}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <button style={{ background: 'none', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Edit / Replace</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
};

export default LibraryManager;
