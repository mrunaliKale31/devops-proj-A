import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Flame, Trophy, AlertTriangle, BookOpen, Target } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Dashboard = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();

  if (!user) return null;

  const { overallPercentage, streak, subjects } = user;

  // Logic for Attendance Overview
  let state = 'success';
  let message = "🔥 You're on track! Keep it up!";
  if (overallPercentage < 60) {
    state = 'danger';
    message = "⚠️ Attendance dropping, improve now!";
  } else if (overallPercentage < 75) {
    state = 'warning';
    message = "⚠️ Risk Zone! Push to 75% soon.";
  }

  const pieData = [
    { name: 'Attended', value: overallPercentage },
    { name: 'Missed', value: 100 - overallPercentage }
  ];

  const pieColors = {
    success: ['var(--success)', 'var(--card-border)'],
    warning: ['var(--warning)', 'var(--card-border)'],
    danger: ['var(--danger)', 'var(--card-border)']
  };

  // Logic for Badges
  const badges = [];
  if (overallPercentage >= 85) badges.push({ id: 'top', icon: <Trophy size={16} />, label: 'Top Attender', type: 'success' });
  if (streak >= 5) badges.push({ id: 'consistent', icon: <Flame size={16} />, label: 'Consistent Performer', type: 'warning' });
  if (overallPercentage < 75) badges.push({ id: 'risk', icon: <AlertTriangle size={16} />, label: 'Risk Zone', type: 'danger' });

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Header section */}
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 className="title" style={{ fontSize: '2.5rem' }}>Welcome, {user.name} 👋</h1>
        <p className="subtitle" style={{ fontSize: '1.2rem', marginTop: '0.25rem', color: `var(--${state})`, fontWeight: 500 }}>
          {message}
        </p>
      </header>

      {/* Top Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        
        {/* Attendance Widget */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ width: '120px', height: '120px', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[state][index]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
            }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: `var(--${state})` }}>{overallPercentage}%</span>
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Overall Attendance</h3>
            <div className="progress-container" style={{ marginBottom: '0.5rem' }}>
              <div 
                className="progress-bar" 
                style={{ width: `${Math.min(overallPercentage, 100)}%`, background: `var(--${state})` }}
              ></div>
            </div>
            <p className="subtitle" style={{ fontSize: '0.85rem' }}>Target: 75% Minimum</p>
          </div>
        </div>

        {/* Gamification Widget */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--warning-bg)', color: 'var(--warning)', padding: '1rem', borderRadius: '16px' }}>
              <Flame size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{streak} Days</h3>
              <p className="subtitle">Current Attendance Streak</p>
            </div>
          </div>
          
          <div>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>YOUR BADGES</h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {badges.length > 0 ? badges.map(b => (
                <span key={b.id} className={`badge ${b.type}`}>
                  {b.icon} {b.label}
                </span>
              )) : (
                <span className="subtitle" style={{ fontSize: '0.85rem' }}>Attend regularly to unlock badges!</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <BookOpen /> Subject Wise Details
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {Object.values(subjects).map((sub, idx) => {
          let sState = 'success';
          if (sub.percentage < 60) sState = 'danger';
          else if (sub.percentage < 75) sState = 'warning';

          return (
            <div 
              key={sub.name}
              className="glass-panel"
              style={{ padding: '1.5rem', cursor: 'pointer', animationDelay: `${idx * 0.1}s` }}
              onClick={() => navigate(`/subject/${encodeURIComponent(sub.name)}`)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{sub.name}</h3>
                  <p className="subtitle">{sub.faculty}</p>
                </div>
                <div style={{
                  background: `var(--${sState}-bg)`,
                  color: `var(--${sState})`,
                  padding: '0.5rem',
                  borderRadius: '12px',
                  fontWeight: 700
                }}>
                  {sub.percentage}%
                </div>
              </div>
              
              <div className="progress-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${Math.min(sub.percentage, 100)}%`, background: `var(--${sState})` }}
                ></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span>{sub.attended} Attended</span>
                <span>{sub.conducted} Total</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
