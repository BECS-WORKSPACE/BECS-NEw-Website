import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { submitAssignment } from '../../api';

// For simplicity in this iteration, we merge the details and submission view into one page
const SubmissionPortal = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  
  const [submissionText, setSubmissionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [error, setError] = useState('');

  // In a real flow, we would fetch Assignment details here to display instructions.
  // For this demo UI, we'll just show the submission form.

  const handleSave = async (isFinalSubmit) => {
    try {
      setIsSubmitting(true);
      setError('');
      
      const payload = {
        submissionText,
        isFinalSubmit,
        files: [] // In Phase 4, we'll wire up S3 Presigned URLs here
      };

      await submitAssignment(assignmentId, payload);
      
      if (isFinalSubmit) {
        navigate('/dashboard'); // Go back to dashboard on final submit
      } else {
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        
        {/* Header */}
        <div style={{ background: '#f8fafc', padding: '24px 32px', borderBottom: '1px solid #e2e8f0' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', color: '#1e293b' }}>Assignment Submission</h1>
          <p style={{ margin: 0, color: '#64748b' }}>Write your answers below or upload your project files.</p>
        </div>

        <div style={{ padding: '32px' }}>
          
          {error && (
            <div style={{ background: '#fef2f2', color: '#ef4444', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
              {error}
            </div>
          )}

          {/* Text Editor Area */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '12px' }}>Online Answer (Rich Text)</label>
            <textarea 
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              placeholder="Type your answer or paste a link to your repository here..."
              style={{ 
                width: '100%', 
                minHeight: '200px', 
                padding: '16px', 
                borderRadius: '8px', 
                border: '1px solid #cbd5e1', 
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* File Upload Area (UI Only for now) */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '12px' }}>File Attachments</label>
            <div style={{ border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '40px', textAlign: 'center', background: '#f8fafc' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📁</div>
              <div style={{ fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Drag & Drop files here</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '16px' }}>Supports PDF, ZIP, DOCX up to 50MB</div>
              <button style={{ background: 'white', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                Browse Files
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
            <div style={{ color: '#10b981', fontWeight: 600 }}>
              {draftSaved && '✅ Draft saved successfully'}
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button 
                onClick={() => handleSave(false)}
                disabled={isSubmitting}
                style={{ background: 'white', color: '#475569', border: '1px solid #cbd5e1', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
              >
                Save Draft
              </button>
              <button 
                onClick={() => handleSave(true)}
                disabled={isSubmitting}
                style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SubmissionPortal;
