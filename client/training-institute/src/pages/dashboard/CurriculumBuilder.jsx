import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const CurriculumBuilder = () => {
  // Local state representing the hierarchy
  // Structure: modules -> chapters -> lessons
  const [modules, setModules] = useState([
    {
      id: 'mod-1',
      title: 'Module 1: Introduction to the Course',
      chapters: [
        {
          id: 'chap-1',
          title: 'Chapter 1: Getting Started',
          lessons: [
            { id: 'les-1', title: 'Welcome to the Course', type: 'video', duration: 5 },
            { id: 'les-2', title: 'Syllabus Overview', type: 'pdf', duration: 10 }
          ]
        }
      ]
    }
  ]);

  const [saving, setSaving] = useState(false);

  // Handle Drag & Drop logic
  const onDragEnd = (result) => {
    const { source, destination, type } = result;

    if (!destination) return; // Dropped outside

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return; // Dropped in the same spot
    }

    // Clone modules state to mutate safely
    const newModules = JSON.parse(JSON.stringify(modules));

    if (type === 'module') {
      const [movedModule] = newModules.splice(source.index, 1);
      newModules.splice(destination.index, 0, movedModule);
      setModules(newModules);
      return;
    }

    if (type === 'chapter') {
      const sourceModuleIndex = newModules.findIndex(m => m.id === source.droppableId);
      const destModuleIndex = newModules.findIndex(m => m.id === destination.droppableId);

      const sourceModule = newModules[sourceModuleIndex];
      const destModule = newModules[destModuleIndex];

      const [movedChapter] = sourceModule.chapters.splice(source.index, 1);
      destModule.chapters.splice(destination.index, 0, movedChapter);
      
      setModules(newModules);
      return;
    }

    if (type === 'lesson') {
      let sourceChapter = null;
      let destChapter = null;

      // Find the source and dest chapters by scanning all modules
      newModules.forEach(mod => {
        mod.chapters.forEach(chap => {
          if (chap.id === source.droppableId) sourceChapter = chap;
          if (chap.id === destination.droppableId) destChapter = chap;
        });
      });

      if (sourceChapter && destChapter) {
        const [movedLesson] = sourceChapter.lessons.splice(source.index, 1);
        destChapter.lessons.splice(destination.index, 0, movedLesson);
        setModules(newModules);
      }
    }
  };

  const handleSave = () => {
    setSaving(true);
    // Simulate API save delay
    setTimeout(() => {
      setSaving(false);
      alert('Curriculum saved successfully!');
    }, 1000);
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '2.2rem', fontFamily: 'Outfit', color: 'var(--navy)', margin: '0 0 8px 0', fontWeight: 800 }}>Curriculum Builder</h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 0 }}>Drag and drop to structure your course hierarchy.</p>
        </div>
        <button onClick={handleSave} disabled={saving} style={{ background: 'var(--primary)', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}>
          {saving ? 'Saving Changes...' : 'Save Curriculum'}
        </button>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="board" type="module">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {modules.map((mod, modIndex) => (
                  <Draggable key={mod.id} draggableId={mod.id} index={modIndex}>
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef} {...provided.draggableProps} 
                        style={{ 
                          ...provided.draggableProps.style,
                          background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0',
                          boxShadow: snapshot.isDragging ? '0 10px 25px rgba(0,0,0,0.1)' : 'none'
                        }}
                      >
                        <div {...provided.dragHandleProps} style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#ffffff', borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ color: '#94a3b8', cursor: 'grab' }}>⠿</span>
                          <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--navy)', fontWeight: 700 }}>{mod.title}</h3>
                          <button style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}>+ Add Chapter</button>
                        </div>
                        
                        <div style={{ padding: '20px' }}>
                          <Droppable droppableId={mod.id} type="chapter">
                            {(provided) => (
                              <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {mod.chapters.map((chap, chapIndex) => (
                                  <Draggable key={chap.id} draggableId={chap.id} index={chapIndex}>
                                    {(provided, snapshot) => (
                                      <div 
                                        ref={provided.innerRef} {...provided.draggableProps} 
                                        style={{ 
                                          ...provided.draggableProps.style,
                                          background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0',
                                          boxShadow: snapshot.isDragging ? '0 8px 20px rgba(0,0,0,0.1)' : 'none'
                                        }}
                                      >
                                        <div {...provided.dragHandleProps} style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', borderRadius: '12px 12px 0 0' }}>
                                          <span style={{ color: '#94a3b8', cursor: 'grab' }}>⠿</span>
                                          <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#334155', fontWeight: 600 }}>{chap.title}</h4>
                                          <button style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#10b981', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>+ Add Lesson</button>
                                        </div>

                                        <div style={{ padding: '16px' }}>
                                          <Droppable droppableId={chap.id} type="lesson">
                                            {(provided) => (
                                              <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '10px' }}>
                                                {chap.lessons.map((les, lesIndex) => (
                                                  <Draggable key={les.id} draggableId={les.id} index={lesIndex}>
                                                    {(provided, snapshot) => (
                                                      <div 
                                                        ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                                        style={{ 
                                                          ...provided.draggableProps.style,
                                                          padding: '12px 16px', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0',
                                                          display: 'flex', alignItems: 'center', gap: '12px',
                                                          boxShadow: snapshot.isDragging ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                                                        }}
                                                      >
                                                        <span style={{ color: '#cbd5e1', cursor: 'grab' }}>⠿</span>
                                                        <span style={{ fontSize: '1.2rem' }}>{les.type === 'video' ? '📺' : '📄'}</span>
                                                        <span style={{ fontWeight: 600, color: '#475569', fontSize: '0.95rem' }}>{les.title}</span>
                                                        <span style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: '0.85rem' }}>{les.duration} mins</span>
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
        <button style={{ padding: '14px 32px', background: 'transparent', border: '2px dashed #cbd5e1', color: '#64748b', borderRadius: '12px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', width: '100%', maxWidth: '400px' }}>
          + Add New Module
        </button>
      </div>

    </div>
  );
};

export default CurriculumBuilder;
