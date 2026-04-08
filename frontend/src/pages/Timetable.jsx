import React, { useState, useEffect } from 'react';
import { Clock, Coffee } from 'lucide-react';
import { TIMESLOTS, IT_CORE_SCHEDULE, parseTimeMins } from '../utils/timetable';

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const Timetable = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const currentDay = currentTime.getDay();

  let currentSlot = null;
  let nextSlot = null;
  let currentSubjectName = 'Free Time / Off Hours';
  let nextSubjectName = 'N/A';

  if (currentDay >= 1 && currentDay <= 5) { 
    for (let i = 0; i < TIMESLOTS.length; i++) {
      const slot = TIMESLOTS[i];
      const startMins = parseTimeMins(slot.start);
      const endMins = parseTimeMins(slot.end);

      if (currentMinutes >= startMins && currentMinutes < endMins) {
        currentSlot = slot;
        currentSubjectName = slot.type === 'lecture' 
          ? (IT_CORE_SCHEDULE[currentDay]?.[slot.id] || 'Self Study')
          : slot.name;

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
                <td style={{ padding: '1rem', fontWeight: '600', fontSize: '0.85rem', borderBottom: '1px solid var(--card-border)', borderRight: '1px solid var(--card-border)', whiteSpace: 'nowrap' }}>
                  {slot.label}
                  {slot.type === 'break' && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>{slot.name}</div>}
                </td>
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
