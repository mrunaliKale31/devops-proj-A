import React, { useState, useEffect } from 'react';

const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div style={{
      padding: '0.75rem 1.5rem',
      background: 'var(--card-bg)',
      borderBottom: '1px solid var(--card-border)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backdropFilter: 'blur(10px)'
    }}>
      <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)', fontWeight: '600' }}>Live Gateway Module</h3>
      <span style={{ 
        fontFamily: 'monospace', 
        fontSize: '1.25rem', 
        fontWeight: 'bold', 
        color: 'var(--primary)' 
      }}>
        {time.toLocaleTimeString()}
      </span>
    </div>
  );
};

export default LiveClock;
