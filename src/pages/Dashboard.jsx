import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Flame, Trophy, AlertTriangle, BookOpen, Target, CalendarDays, Clock, Info } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { TIMESLOTS, IT_CORE_SCHEDULE, parseTimeMins } from '../utils/timetable';

const SubjectTheme = {
  'DEVOPS': '#f97316', // Orange
  'Automation Testing': '#10b981', // Green
  'Foundation of AI': '#a855f7', // Purple
  'Application Security': '#ef4444', // Red
};

const Dashboard = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (!user) return null;

  const { overallPercentage, streak, subjects, weakestSubject, totalAttended, totalConducted, weeklySummary } = user;

  // Logic for Attendance Overview
  let state = 'success';
  if (overallPercentage < 60) state = 'danger';
  else if (overallPercentage < 75) state = 'warning';

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

  // Predictor Logic
  let predictorMsg = '';
  if (overallPercentage < 75) {
    const needed = Math.ceil((0.75 * totalConducted - totalAttended) / 0.25);
    predictorMsg = `You need to attend next ${needed} lectures continuously to reach 75%`;
  } else {
    const buffer = Math.floor((totalAttended - 0.75 * totalConducted) / 0.75);
    predictorMsg = buffer > 0 ? `Safe! You can afford to miss ${buffer} lectures.` : 'You are exactly at 75%. Safe zone border!';
  }

  // Today's schedule Logic
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const currentDay = currentTime.getDay();
  let todaysLectures = [];
  let currentSlotId = null;
  let nextSlotId = null;

  if (currentDay >= 1 && currentDay <= 5) {
    let foundCurrent = false;
    TIMESLOTS.forEach((slot, i) => {
      const subjectName = slot.type === 'lecture' 
        ? (IT_CORE_SCHEDULE[currentDay]?.[slot.id] || 'Self Study') 
        : slot.name;
      
      const startMins = parseTimeMins(slot.start);
      const endMins = parseTimeMins(slot.end);
      
      todaysLectures.push({ slot, subjectName, startMins, endMins });

      if (!foundCurrent && currentMinutes >= startMins && currentMinutes < endMins) {
        currentSlotId = slot.id;
        foundCurrent = true;
      } else if (!foundCurrent && currentMinutes < startMins && !nextSlotId) {
        nextSlotId = slot.id;
      }
    });

    if (foundCurrent) {
      // Find following slot
      const curIdx = todaysLectures.findIndex(s => s.slot.id === currentSlotId);
      if (curIdx < todaysLectures.length - 1) {
        nextSlotId = todaysLectures[curIdx + 1].slot.id;
      }
    }
  }

  // Subject Comparison Chart Data
  const compData = Object.values(subjects).map(s => ({
    name: s.name.split(' ')[0], // abbreviate
    percentage: s.percentage,
    fill: SubjectTheme[s.name] || 'var(--primary)'
  }));

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      
      {/* Dynamic Header & Smart Insights Alert */}
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 className="title" style={{ fontSize: '2.5rem' }}>Welcome, {user.name} 👋</h1>
        <p className="subtitle" style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>{user.enrollment}</p>

        {weakestSubject && subjects[weakestSubject].percentage < 75 && (
          <div 
            onClick={() => navigate(`/subject/${encodeURIComponent(weakestSubject)}`)}
            className="pulse-active"
            style={{
              padding: '1rem 1.5rem', borderRadius: '12px', background: 'var(--danger-bg)', 
              color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '1rem', 
              cursor: 'pointer', border: '1px solid var(--danger)'
            }}
          >
            <AlertTriangle size={24} />
            <div style={{ flex: 1 }}>
              <strong style={{ display: 'block', fontSize: '1rem' }}>⚠️ Risk Zone! Push to 75% soon</strong>
              <span style={{ fontSize: '0.85rem' }}>Weakest subject: {weakestSubject} ({subjects[weakestSubject].percentage}%)</span>
            </div>
          </div>
        )}
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        {/* Attendance Overview Widget */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ width: '100px', height: '100px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={50} paddingAngle={2} dataKey="value" animationDuration={1000}>
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={pieColors[state][index]} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: `var(--${state})` }}>{overallPercentage}%</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Overall Score</h3>
              <div className="progress-container" style={{ marginBottom: '0.5rem', height: '10px' }}>
                <div className="progress-bar" style={{ width: `${Math.min(overallPercentage, 100)}%`, background: `var(--${state})` }}></div>
                {/* 75% Marker */}
                <div style={{ position: 'absolute', top: 0, left: '75%', width: '2px', height: '10px', background: 'var(--text-main)' }}></div>
              </div>
              <p className="subtitle" style={{ fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>{75 - overallPercentage > 0 ? `${75 - overallPercentage}% away from safe zone` : 'In safe zone'}</span>
                <span style={{ fontWeight: 600 }}>🎯 Target: 75%</span>
              </p>
            </div>
          </div>
          
          <div style={{ padding: '0.75rem', background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--card-border)', fontSize: '0.85rem' }}>
            <strong>🤖 Predictor:</strong> {predictorMsg}
          </div>
        </div>

        {/* Gamification & Smart Insights */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'var(--warning-bg)', color: 'var(--warning)', padding: '1rem', borderRadius: '16px' }}>
                <Flame size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{streak} Days</h3>
                <p className="subtitle" style={{ fontSize: '0.85rem' }}>Current Streak</p>
              </div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <p className="subtitle" style={{ fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Weekly Summary</p>
              <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{weeklySummary.attended}/{weeklySummary.conducted} Attended</h4>
            </div>
          </div>
          
          <div style={{ marginTop: '1.5rem' }}>
            <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>YOUR BADGES</h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {badges.map(b => (
                <span key={b.id} className={`badge ${b.type}`}>
                  {b.icon} {b.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        
        {/* Today's Classes */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarDays size={20} color="var(--primary)" /> Today's Schedule
          </h2>
          {currentDay >= 1 && currentDay <= 5 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {todaysLectures.map((item, idx) => {
                const isNow = item.slot.id === currentSlotId;
                const isNext = item.slot.id === nextSlotId;
                
                let bg = 'var(--bg-color)';
                let border = '1px solid var(--card-border)';
                let glow = '';
                
                if (isNow) {
                  bg = 'var(--primary-hover)15';
                  border = '1px solid var(--primary)';
                  glow = '0 0 10px rgba(79, 70, 229, 0.4)';
                } else if (isNext) {
                  bg = 'rgba(56, 189, 248, 0.1)';
                  border = '1px solid #38bdf8';
                }

                return (
                  <div key={idx} style={{
                    padding: '0.75rem 1rem', borderRadius: '12px', background: bg, border,
                    boxShadow: glow, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    transition: 'var(--transition)'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.15rem' }}>
                        {item.slot.start} - {item.slot.end}
                      </span>
                      <strong style={{ fontSize: '0.9rem', color: isNow ? 'var(--primary)' : 'var(--text-main)' }}>
                        {item.subjectName}
                        {item.slot.type === 'break' && ' ☕'}
                      </strong>
                    </div>
                    {isNow && <span className="badge" style={{ background: 'var(--primary)', color: 'white', fontSize: '0.7rem' }}>Now</span>}
                    {isNext && <span className="badge" style={{ background: '#38bdf8', color: 'white', fontSize: '0.7rem' }}>Next</span>}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Weekend - No Classes Today</div>
          )}
        </div>

        {/* Subject Comparison */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={20} color="var(--success)" /> Subject Comparison
          </h2>
          <div style={{ width: '100%', height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{fontSize: 11}} interval={0} />
                <YAxis domain={[0, 100]} tick={{fontSize: 11}} />
                <RechartsTooltip cursor={{fill: 'var(--bg-color)', opacity: 0.4}} contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px' }} />
                <Bar dataKey="percentage" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Subjects Grid */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <BookOpen /> Subject Cards
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {Object.values(subjects).map((sub, idx) => {
          let sState = 'success';
          if (sub.percentage < 60) sState = 'danger';
          else if (sub.percentage < 75) sState = 'warning';

          const customColor = SubjectTheme[sub.name] || `var(--${sState})`;

          return (
            <div 
              key={sub.name}
              className="glass-panel"
              title={`Last Attended: ${sub.lastAttended || 'Never'}\nLast Absent: ${sub.lastAbsent || 'Never'}`}
              style={{ 
                padding: '1.5rem', cursor: 'pointer', animationDelay: `${idx * 0.1}s`,
                position: 'relative', overflow: 'hidden'
              }}
              onClick={() => navigate(`/subject/${encodeURIComponent(sub.name)}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = `0 12px 30px ${customColor}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
              }}
            >
              {/* Decor strip */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: customColor }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', paddingLeft: '8px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '170px' }}>{sub.name}</h3>
                  <p className="subtitle" style={{ fontSize: '0.85rem' }}>{sub.faculty}</p>
                </div>
                <div style={{
                  background: `${customColor}20`, color: customColor,
                  padding: '0.5rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem'
                }}>
                  {sub.percentage}%
                </div>
              </div>
              
              <div className="progress-container" style={{ marginLeft: '8px', width: 'calc(100% - 8px)' }}>
                <div className="progress-bar" style={{ width: `${Math.min(sub.percentage, 100)}%`, background: customColor }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '8px' }}>
                <span>{sub.attended} / {sub.conducted} Attended</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Info size={14}/> Hover stats</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
