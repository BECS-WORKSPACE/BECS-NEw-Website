import React, { useState } from 'react';

const DashboardCalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Dummy event data for demonstration
  const events = [
    { id: 1, date: 15, title: 'Data Science Assignment Due', type: 'deadline', color: '#ef4444', bg: '#fef2f2' },
    { id: 2, date: 18, title: 'System Design Live Class', type: 'live', color: '#3b82f6', bg: '#eff6ff', time: '4:00 PM' },
    { id: 3, date: 20, title: 'Mock Test: React Advanced', type: 'test', color: '#f59e0b', bg: '#fffbeb', time: '10:00 AM' },
    { id: 4, date: 25, title: 'Project Submission', type: 'deadline', color: '#ef4444', bg: '#fef2f2' }
  ];

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const renderCells = () => {
    const cells = [];
    // Empty cells before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(<div key={`empty-${i}`} style={{ padding: '16px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}></div>);
    }
    
    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      const dayEvents = events.filter(e => e.date === d);
      const isToday = d === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
      
      cells.push(
        <div key={d} style={{ 
          padding: '12px', minHeight: '120px', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0',
          background: isToday ? '#eff6ff' : '#ffffff'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ 
              fontWeight: 700, fontSize: '1.1rem',
              color: isToday ? '#2563eb' : '#475569',
              background: isToday ? '#bfdbfe' : 'transparent',
              borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {d}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {dayEvents.map(ev => (
              <div key={ev.id} style={{ padding: '6px 8px', borderRadius: '6px', background: ev.bg, color: ev.color, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', borderLeft: `3px solid ${ev.color}` }}>
                {ev.time && <span style={{ display: 'block', fontSize: '0.7rem', opacity: 0.8, marginBottom: '2px' }}>{ev.time}</span>}
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.title}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return cells;
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h2 style={{ fontSize: '2.2rem', fontFamily: 'Outfit', color: 'var(--navy)', margin: '0 0 8px 0', fontWeight: 800 }}>Learning Calendar</h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 0 }}>Never miss a deadline. Track all your live classes, tests, and assignments.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button style={{ padding: '10px 20px', background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '12px', fontWeight: 600 }}>● Deadlines</button>
          <button style={{ padding: '10px 20px', background: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: '12px', fontWeight: 600 }}>● Live Classes</button>
          <button style={{ padding: '10px 20px', background: '#fffbeb', color: '#f59e0b', border: 'none', borderRadius: '12px', fontWeight: 600 }}>● Mock Tests</button>
        </div>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '24px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        
        {/* Calendar Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <h3 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--navy)', fontWeight: 800 }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={prevMonth} style={{ padding: '8px 16px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#475569' }}>&lt; Prev</button>
            <button onClick={() => setCurrentDate(new Date())} style={{ padding: '8px 16px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#475569' }}>Today</button>
            <button onClick={nextMonth} style={{ padding: '8px 16px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#475569' }}>Next &gt;</button>
          </div>
        </div>

        {/* Days of Week */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} style={{ padding: '16px', textAlign: 'center', fontWeight: 700, color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', borderRight: '1px solid #e2e8f0' }}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {renderCells()}
        </div>

      </div>

    </div>
  );
};

export default DashboardCalendarPage;
