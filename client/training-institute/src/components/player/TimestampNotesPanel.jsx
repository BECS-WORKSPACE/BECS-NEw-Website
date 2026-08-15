import React, { useState, useEffect } from 'react';
import { createVideoNote, getVideoNotes } from '../../api';

const TimestampNotesPanel = ({ lessonId, currentTimestamp }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!lessonId) return;
    const fetchNotes = async () => {
      try {
        const res = await getVideoNotes(lessonId);
        if (res) setNotes(res);
      } catch (err) {
        console.error('Failed to load notes', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [lessonId]);

  const handleSaveNote = async () => {
    if (!newNote.trim()) return;
    setSaving(true);
    try {
      const saved = await createVideoNote({
        courseId: 'dummy-for-now', // In a real app, pass courseId down
        lessonId,
        timestamp: currentTimestamp,
        text: newNote
      });
      if (saved) {
        setNotes([...notes, saved].sort((a, b) => a.timestamp - b.timestamp));
        setNewNote('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSeek = (timestamp) => {
    // Fire a custom event to the player
    const event = new CustomEvent('SEEK_VIDEO', { detail: { lessonId, timestamp } });
    window.dispatchEvent(event);
  };

  const formatTime = (timeInSeconds) => {
    const m = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const s = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
        <h3 style={{ margin: 0, color: 'var(--navy)', fontSize: '1.1rem', fontWeight: 700 }}>My Notes</h3>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading ? (
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center' }}>Loading notes...</p>
        ) : notes.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span style={{ fontSize: '2rem' }}>📝</span>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No notes for this lesson yet.</p>
          </div>
        ) : (
          notes.map((note, idx) => (
            <div key={note._id || idx} style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', borderLeft: `4px solid ${note.color}` }}>
              <div 
                onClick={() => handleSeek(note.timestamp)}
                style={{ 
                  display: 'inline-block', background: 'rgba(59,130,246,0.1)', color: '#2563eb', 
                  padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, 
                  cursor: 'pointer', marginBottom: '8px' 
                }}
              >
                ▶ {formatTime(note.timestamp)}
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', lineHeight: '1.4' }}>{note.text}</p>
            </div>
          ))
        )}
      </div>

      <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder={`Add a note at ${formatTime(currentTimestamp)}...`}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'none', height: '80px', fontFamily: 'inherit', fontSize: '0.9rem', boxSizing: 'border-box' }}
        />
        <button 
          onClick={handleSaveNote}
          disabled={saving || !newNote.trim()}
          style={{ width: '100%', padding: '10px', marginTop: '8px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: saving || !newNote.trim() ? 'not-allowed' : 'pointer', opacity: saving || !newNote.trim() ? 0.7 : 1 }}
        >
          {saving ? 'Saving...' : 'Save Note'}
        </button>
      </div>
    </div>
  );
};

export default TimestampNotesPanel;
