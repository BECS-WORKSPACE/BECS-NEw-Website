import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../../api';

const CurriculumBuilder = () => {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('course');
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchCurriculum();
    } else {
      setLoading(false);
    }
  }, [courseId]);

  const fetchCurriculum = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/curriculum/${courseId}`);
      setModules(res.data || []);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch curriculum');
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = (result) => {
    // Basic structural drag and drop. Server sync omitted for brevity in this step.
    const { source, destination, type } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    
    // In a real implementation you would splice the arrays and update state
    // and then call api.put('/curriculum/reorder')
    alert("Drag and drop reordering requires backend sync implementation.");
  };

  const handleAddModule = async () => {
    const title = prompt("Enter module title:");
    if (!title) return;
    try {
      await api.post('/curriculum/module', { courseId, title, order: modules.length });
      fetchCurriculum();
    } catch (err) {
      console.error(err);
      alert("Failed to add module");
    }
  };

  const handleAddChapter = async (moduleId) => {
    const title = prompt("Enter chapter title:");
    if (!title) return;
    const modIndex = modules.findIndex(m => m._id === moduleId);
    const order = modules[modIndex].chapters?.length || 0;
    try {
      await api.post('/curriculum/chapter', { courseId, moduleId, title, order });
      fetchCurriculum();
    } catch (err) {
      console.error(err);
      alert("Failed to add chapter");
    }
  };

  const handleAddLesson = async (moduleId, chapterId) => {
    const title = prompt("Enter lesson title:");
    if (!title) return;
    try {
      await api.post('/curriculum/lesson', { courseId, moduleId, chapterId, title, type: 'video' });
      fetchCurriculum();
    } catch (err) {
      console.error(err);
      alert("Failed to add lesson");
    }
  };

  if (!courseId) {
    return <div style={{ padding: '40px' }}>Please select a course from My Courses first.</div>;
  }

  if (loading) return <div style={{ padding: '40px' }}>Loading Curriculum...</div>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '2.2rem', fontFamily: 'Outfit', color: 'var(--navy)', margin: '0 0 8px 0', fontWeight: 800 }}>Curriculum Builder</h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 0 }}>Manage modules, chapters and lessons.</p>
        </div>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="board" type="module">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {modules.map((mod, modIndex) => (
                  <Draggable key={mod._id} draggableId={mod._id} index={modIndex}>
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} style={{ ...provided.draggableProps.style, background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <div {...provided.dragHandleProps} style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#ffffff', borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ color: '#94a3b8', cursor: 'grab' }}>⠿</span>
                          <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--navy)', fontWeight: 700 }}>{mod.title}</h3>
                          <button onClick={() => handleAddChapter(mod._id)} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}>+ Add Chapter</button>
                        </div>
                        <div style={{ padding: '20px' }}>
                          <Droppable droppableId={mod._id} type="chapter">
                            {(provided) => (
                              <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {mod.chapters?.map((chap, chapIndex) => (
                                  <Draggable key={chap._id} draggableId={chap._id} index={chapIndex}>
                                    {(provided) => (
                                      <div ref={provided.innerRef} {...provided.draggableProps} style={{ ...provided.draggableProps.style, background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                        <div {...provided.dragHandleProps} style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', borderRadius: '12px 12px 0 0' }}>
                                          <span style={{ color: '#94a3b8', cursor: 'grab' }}>⠿</span>
                                          <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#334155', fontWeight: 600 }}>{chap.title}</h4>
                                          <button onClick={() => handleAddLesson(mod._id, chap._id)} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#10b981', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>+ Add Lesson</button>
                                        </div>
                                        <div style={{ padding: '16px' }}>
                                          <Droppable droppableId={chap._id} type="lesson">
                                            {(provided) => (
                                              <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '10px' }}>
                                                {chap.lessons?.map((les, lesIndex) => (
                                                  <Draggable key={les._id} draggableId={les._id} index={lesIndex}>
                                                    {(provided) => (
                                                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{ ...provided.draggableProps.style, padding: '12px 16px', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <span style={{ color: '#cbd5e1', cursor: 'grab' }}>⠿</span>
                                                        <span style={{ fontSize: '1.2rem' }}>{les.type === 'video' ? '📺' : '📄'}</span>
                                                        <span style={{ fontWeight: 600, color: '#475569', fontSize: '0.95rem' }}>{les.title}</span>
                                                      </div>
                                                    )}
                                                  </Draggable>
                                                ))}
                                                {provided.placeholder}
                                              </div>
                                            )}
                                          </Droppable>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      
      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <button onClick={handleAddModule} style={{ padding: '14px 32px', background: 'transparent', border: '2px dashed #cbd5e1', color: '#64748b', borderRadius: '12px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', width: '100%', maxWidth: '400px' }}>
          + Add New Module
        </button>
      </div>
    </div>
  );
};

export default CurriculumBuilder;
