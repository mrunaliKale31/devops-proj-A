import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const SubjectDetail = () => {
  const { subjectName } = useParams();
  const navigate = useNavigate();
  const { user } = useAppContext();

  const decodedName = decodeURIComponent(subjectName);
  
  if (!user || !user.subjects[decodedName]) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Subject Not Found</h2>
        <button className="btn-primary" onClick={() => navigate('/')}>Back to Dashboard</button>
      </div>
    );
  }

  const subject = user.subjects[decodedName];
  
  // Filter history for this subject
  const history = useMemo(() => {
    return user.history.filter(h => h.subject === decodedName);
  }, [user, decodedName]);

  // Generate data for trend graph (cumulative percentage over time)
  const trendData = useMemo(() => {
    const reversedHistory = [...history].reverse(); // oldest first
    let attended = 0;
    return reversedHistory.map((h, i) => {
      if (h.status === 'Present') attended++;
      const currentAvg = Math.round((attended / (i + 1)) * 100);
      return {
        date: h.date,
        percentage: currentAvg
      };
    });
  }, [history]);

  let sState = 'success';
  if (subject.percentage < 60) sState = 'danger';
  else if (subject.percentage < 75) sState = 'warning';

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <button 
        onClick={() => navigate('/')} 
        style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem', 
          background: 'transparent', border: 'none', 
          color: 'var(--text-muted)', cursor: 'pointer',
          fontFamily: 'inherit', fontWeight: 600,
          marginBottom: '2rem'
        }}
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h1 className="title" style={{ fontSize: '2rem', margin: 0 }}>{subject.name}</h1>
            <p className="subtitle" style={{ fontSize: '1.1rem' }}>{subject.faculty}</p>
          </div>
          <div style={{
            background: `var(--${sState}-bg)`,
            color: `var(--${sState})`,
            padding: '1rem 1.5rem',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '2rem', margin: 0 }}>{subject.percentage}%</h2>
            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Attendance</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem', maxWidth: '400px' }}>
          <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
            <p className="subtitle">Lectures Attended</p>
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{subject.attended}</h3>
          </div>
          <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
            <p className="subtitle">Total Conducted</p>
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{subject.conducted}</h3>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
        {/* Lecture History Table */}
        <div className="glass-panel" style={{ padding: '2rem', overflowX: 'auto' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Lecture History</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--card-border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Time Slot</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i} style={{ 
                  borderBottom: '1px solid var(--card-border)',
                  background: h.status === 'Absent' ? 'var(--danger-bg)' : 'transparent'
                }}>
                  <td style={{ padding: '1rem' }}>{h.date}</td>
                  <td style={{ padding: '1rem' }}>{h.timeslot}</td>
                  <td style={{ padding: '1rem' }}>
                    {h.status === 'Present' ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: 600 }}>
                        <CheckCircle size={16} /> Present
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', fontWeight: 600 }}>
                        <XCircle size={16} /> Absent
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No lectures recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Trend Graph */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Attendance Trend</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{fontSize: 10}} tickFormatter={(val) => val.slice(5)} />
                <YAxis domain={[0, 100]} tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="percentage" stroke="var(--primary)" fillOpacity={1} fill="url(#colorTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SubjectDetail;
