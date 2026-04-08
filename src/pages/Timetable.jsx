import React, { useState, useEffect } from 'react';
import { Clock, Coffee, BookOpen } from 'lucide-react';

// Define timeslots mapping
const TIMESLOTS = [
  { id: 1, label: '08:45-09:40', start: '08:45', end: '09:40', type: 'lecture' },
  { id: 2, label: '09:40-10:35', start: '09:40', end: '10:35', type: 'lecture' },
  { id: 3, label: '10:35-10:50', start: '10:35', end: '10:50', type: 'break', name: 'Short Break' },
  { id: 4, label: '10:50-11:45', start: '10:50', end: '11:45', type: 'lecture' },
  { id: 5, label: '11:45-12:40', start: '11:45', end: '12:40', type: 'lecture' },
  { id: 6, label: '12:40-13:40', start: '12:40', end: '13:40', type: 'break', name: 'Long Break' },
  { id: 7, label: '13:40-14:35', start: '13:40', end: '14:35', type: 'lecture' }, // 01:40 -> 13:40
  { id: 8, label: '14:35-15:30', start: '14:35', end: '15:30', type: 'lecture' },
  { id: 9, label: '15:30-15:40', start: '15:30', end: '15:40', type: 'break', name: 'Short Break' },
  { id: 10, label: '15:40-16:30', start: '15:40', end: '16:30', type: 'lecture' },
];

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Mock IT CORE Schedule mapped by day index (1=Monday ... 5=Friday) and slot ID
const IT_CORE_SCHEDULE = {
  1: { 1: 'DEVOPS', 2: 'Automation Testing', 4: 'Application Security', 5: 'Foundation of AI', 7: 'DEVOPS (Lab)', 8: 'DEVOPS (Lab)', 10: 'Library' },
  2: { 1: 'Application Security', 2: 'Foundation of AI', 4: 'Automation Testing', 5: 'DEVOPS', 7: 'Project Meeting', 8: 'Project Meeting', 10: 'Library' },
  3: { 1: 'Foundation of AI', 2: 'DEVOPS', 4: 'SCIL Aptitude', 5: 'Automation Testing', 7: 'Application Sec (Lab)', 8: 'Application Sec (Lab)', 10: 'Library' },
  4: { 1: 'Automation Testing', 2: 'Application Security', 4: 'DEVOPS', 5: 'Foundation of AI', 7: 'SCIL Professional Skills', 8: 'Library', 10: 'Mentor Meeting' },
  5: { 1: 'SHD', 2: 'SHD', 4: 'Application Security', 5: 'Automation Testing', 7: 'Foundation of AI (Lab)', 8: 'Foundation of AI (Lab)', 10: 'DEVOPS' }
};

const Timetable = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // update every minute
    return () => clearInterval(timer);
  }, []);

  // Helper to parse 'HH:MM' into comparable minutes from midnight
  const parseTime = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const currentDay = currentTime.getDay(); // 0 is Sunday, 1 is Monday ... 5 is Friday

  let currentSlot = null;
  let nextSlot = null;
  let currentSubjectName = 'Free Time / Off Hours';
  let nextSubjectName = 'N/A';

  // Find current and next slots based on time
  if (currentDay >= 1 && currentDay <= 5) { // Only Mon-Fri
    for (let i = 0; i < TIMESLOTS.length; i++) {
      const slot = TIMESLOTS[i];
      const startMins = parseTime(slot.start);
      const endMins = parseTime(slot.end);

      if (currentMinutes >= startMins && currentMinutes < endMins) {
        currentSlot = slot;
        currentSubjectName = slot.type === 'lecture' 
          ? (IT_CORE_SCHEDULE[currentDay]?.[slot.id] || 'Self Study')
          : slot.name;

        // Find next slot
        if (i + 1 < TIMESLOTS.length) {
          nextSlot = TIMESLOTS[i + 1];
          nextSubjectName = nextSlot.type === 'lecture'
            ? (IT_CORE_SCHEDULE[currentDay]?.[nextSlot.id] || 'Self Study')
            : nextSlot.name;
        } else {
          nextSubjectName = 'Day End';
        }
        break;
      } else if (currentMinutes < startMins && !currentSlot) {
        // We are before this slot
        if (!nextSlot) {
          nextSlot = slot;
          nextSubjectName = slot.type === 'lecture'
            ? (IT_CORE_SCHEDULE[currentDay]?.[slot.id] || 'Self Study')
            : slot.name;
        }
      }
    }
  } else {
    currentSubjectName = 'Weekend - No Classes';
  }

  // Handle rendering of cells in timetable
  const renderCell = (dayIdx, slot) => {
    if (slot.type === 'break') {
      return (
        <td key={`${dayIdx}-${slot.id}`} className="subtitle" style={{ textAlign: 'center', background: 'var(--card-border)', fontSize: '0.8rem' }}>
          <Coffee size={14} style={{ marginBottom: '4px' }} />
        </td>
      );
    }

    const subject = IT_CORE_SCHEDULE[dayIdx]?.[slot.id] || '-';
    const isCurrent = currentDay === dayIdx && currentSlot?.id === slot.id;
    const isNext = currentDay === dayIdx && nextSlot?.id === slot.id;

    let cellClass = '';
    let cellStyle = { padding: '1rem', textAlign: 'center', fontSize: '0.85rem', border: '1px solid var(--card-border)', transition: 'var(--transition)' };

    if (isCurrent) {
      cellClass = 'pulse-active';
      cellStyle.background = 'var(--primary-hover)15';
      cellStyle.backgroundColor = 'rgba(79, 70, 229, 0.15)';
      cellStyle.fontWeight = 700;
      cellStyle.color = 'var(--primary)';
      cellStyle.border = '2px solid var(--primary)';
    } else if (isNext) {
      cellStyle.background = 'rgba(56, 189, 248, 0.1)';
      cellStyle.border = '1px solid #38bdf8';
    }

    return (
      <td key={`${dayIdx}-${slot.id}`} className={cellClass} style={cellStyle}>
        {subject}
        {isCurrent && <div style={{ fontSize: '0.7rem', marginTop: '0.25rem', color: 'var(--primary)' }}>Now Playing</div>}
        {isNext && <div style={{ fontSize: '0.7rem', marginTop: '0.25rem', color: '#38bdf8' }}>Up Next</div>}
      </td>
    );
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 className="title" style={{ fontSize: '2.5rem' }}>Smart Timetable 📅</h1>
        <p className="subtitle" style={{ fontSize: '1.1rem' }}>Schedules for IT CORE Division</p>
      </header>

      {/* Smart Status Widget */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--primary-hover)15', backgroundColor: 'rgba(79, 70, 229, 0.1)', padding: '1rem', borderRadius: '16px', color: 'var(--primary)' }}>
            <Clock size={24} />
          </div>
          <div>
            <p className="subtitle" style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>Local Time</p>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </h3>
          </div>
        </div>

        <div style={{ flex: 1, borderLeft: '1px solid var(--card-border)', paddingLeft: '2rem' }}>
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            <div>
              <p className="subtitle" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></span> NOW ONGOING
              </p>
              <h3 style={{ fontSize: '1.5rem', margin: '0.25rem 0 0 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {currentSubjectName}
              </h3>
            </div>
            
            <div>
              <p className="subtitle" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#38bdf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }}></span> NEXT UP
              </p>
              <h3 style={{ fontSize: '1.5rem', margin: '0.25rem 0 0 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {nextSubjectName}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Week Schedule View */}
      <div className="glass-panel" style={{ padding: '2rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-muted)', borderBottom: '2px solid var(--card-border)' }}>Time/Day</th>
              {WEEKDAYS.map(day => (
                <th key={day} style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: 'var(--text-muted)', borderBottom: '2px solid var(--card-border)' }}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIMESLOTS.map(slot => (
              <tr key={slot.id}>
                {/* Time Column */}
                <td style={{ padding: '1rem', fontWeight: '600', fontSize: '0.85rem', borderBottom: '1px solid var(--card-border)', borderRight: '1px solid var(--card-border)', whiteSpace: 'nowrap' }}>
                  {slot.label}
                  {slot.type === 'break' && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>{slot.name}</div>}
                </td>

                {/* Day Columns */}
                {slot.type === 'break' ? (
                  <td colSpan={5} style={{ background: 'var(--card-border)', borderBottom: '1px solid var(--card-border)', opacity: 0.5 }}></td>
                ) : (
                  [1, 2, 3, 4, 5].map(dayIdx => renderCell(dayIdx, slot))
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timetable;
