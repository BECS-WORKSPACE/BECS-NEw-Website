import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api';

const TeacherMaterials = () => {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('course');
  
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    title: '', description: '', type: 'pdf', fileUrl: '', courseId: courseId || ''
  });

  useEffect(() => {
    fetchMaterials();
    fetchCourses();
  }, [courseId]);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/teacher/courses');
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const endpoint = courseId ? `/teacher/materials?courseId=${courseId}` : '/teacher/materials';
      const res = await api.get(endpoint);
      setMaterials(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    try {
      // Re-use the existing libraryController createResource, mapped in libraryRoutes.js probably?
      // Wait, we need to make sure the endpoint exists. For now, post to /library if it allows teachers.
      // Or we can just use the generic /library endpoint if it's protected.
      await api.post('/library', newMaterial);
      setShowAddForm(false);
      setNewMaterial({ title: '', description: '', type: 'pdf', fileUrl: '', courseId: '' });
      fetchMaterials();
    } catch (err) {
      console.error(err);
      alert('Failed to add material. Ensure /api/library accepts POST from teachers.');
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading Materials...</div>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#1e293b', margin: '0 0 8px 0', fontWeight: 800 }}>Study Materials</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Upload and manage PDFs, notes, and pyqs for your courses.</p>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          {showAddForm ? 'Cancel' : '+ Add Material'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddMaterial} style={{ background: 'white', padding: '24px', borderRadius: '16px', marginBottom: '32px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 16px 0' }}>Upload New Material</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <input required placeholder="Title" value={newMaterial.title} onChange={e => setNewMaterial({...newMaterial, title: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            <select required value={newMaterial.courseId} onChange={e => setNewMaterial({...newMaterial, courseId: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <option value="" disabled>Select Course</option>
              {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
            <select required value={newMaterial.type} onChange={e => setNewMaterial({...newMaterial, type: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <option value="pdf">PDF</option>
              <option value="notes">Notes</option>
              <option value="pyq">PYQ</option>
              <option value="video">Video</option>
            </select>
            <input required placeholder="File URL (e.g. AWS S3 Link)" value={newMaterial.fileUrl} onChange={e => setNewMaterial({...newMaterial, fileUrl: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
          </div>
          <textarea placeholder="Description (optional)" value={newMaterial.description} onChange={e => setNewMaterial({...newMaterial, description: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '16px' }} />
          <button type="submit" style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Upload Resource</button>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {materials.length === 0 ? (
          <p style={{ color: '#64748b' }}>No materials uploaded yet.</p>
        ) : (
          materials.map(mat => (
            <div key={mat._id} style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '2rem' }}>{mat.type === 'pdf' ? '📄' : mat.type === 'video' ? '📺' : '📚'}</span>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#1e293b' }}>{mat.title}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '12px' }}>{mat.courseId?.title || 'Unknown Course'}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 16px 0' }}>{mat.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Views: {mat.viewCount}</span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Downloads: {mat.downloadCount}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherMaterials;
