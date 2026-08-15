import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api'; // Assuming standard api wrapper

const AssignmentBuilder = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    courseId: '',
    type: 'homework',
    maxMarks: 100,
    passingMarks: 40,
    dueDate: '',
    allowLateSubmission: false,
    latePenaltyPercentage: 0,
    isPremium: false,
    description: '',
    instructions: ''
  });

  useEffect(() => {
    // Fetch available courses so the teacher can link the assignment
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');
        setCourses(res.data.courses || res.data || []);
      } catch (err) {
        console.error('Failed to load courses', err);
        // Fallback for UI demo
        setCourses([{ _id: 'c1', title: 'Full Stack Development Bootcamp' }]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/assignments', formData);
      alert('Assignment Published Successfully!');
      setFormData({ ...formData, title: '', description: '', instructions: '' }); // reset some fields
    } catch (err) {
      alert('Failed to publish assignment. Check backend logs.');
      console.error(err);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Builder...</div>;

  return (
    <div style={{ padding: '32px', fontFamily: 'Inter, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: '#1e293b' }}>Assignment Builder</h1>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Create and publish a new assignment to your course.</p>

      <form onSubmit={handleSubmit} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '32px' }}>
        
        {/* Core Settings */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Assignment Title</label>
            <input 
              required 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Node.js Authentication Project"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Target Course</label>
            <select 
              required
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            >
              <option value="">Select a Course...</option>
              {courses.map(course => (
                <option key={course._id} value={course._id}>{course.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Configurations */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px', background: '#f8fafc', padding: '24px', borderRadius: '8px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Type</label>
            <select 
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            >
              <option value="homework">Homework</option>
              <option value="project">Project</option>
              <option value="case_study">Case Study</option>
              <option value="lab">Lab Assignment</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Max Marks</label>
            <input 
              required 
              type="number" 
              name="maxMarks"
              value={formData.maxMarks}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Due Date</label>
            <input 
              required 
              type="date" 
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Content */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Short Description</label>
          <input 
            type="text" 
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Briefly describe the goal..."
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Detailed Instructions (Rich Text)</label>
          <textarea 
            required
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            placeholder="Write out the full problem statement, requirements, and evaluation criteria..."
            style={{ width: '100%', minHeight: '200px', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
          />
        </div>

        {/* Toggles */}
        <div style={{ display: 'flex', gap: '32px', marginBottom: '32px', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500, color: '#475569' }}>
            <input 
              type="checkbox" 
              name="allowLateSubmission" 
              checked={formData.allowLateSubmission} 
              onChange={handleChange} 
              style={{ width: '18px', height: '18px' }}
            />
            Allow Late Submissions
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500, color: '#475569' }}>
            <input 
              type="checkbox" 
              name="isPremium" 
              checked={formData.isPremium} 
              onChange={handleChange} 
              style={{ width: '18px', height: '18px' }}
            />
            Require Premium Subscription 👑
          </label>
        </div>

        <button type="submit" style={{ width: '100%', background: '#4f46e5', color: 'white', border: 'none', padding: '16px', borderRadius: '8px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer' }}>
          Publish Assignment
        </button>

      </form>
    </div>
  );
};

export default AssignmentBuilder;
