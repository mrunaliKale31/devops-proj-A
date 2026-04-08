import React from 'react';
import { X, User, Moon, Sun, Bell, Lock, Download, Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const SettingsModal = ({ isOpen, onClose }) => {
  const { user, darkMode, toggleDarkMode, notificationsEnabled, toggleNotifications, lastUpdated } = useAppContext();

  if (!isOpen || !user) return null;

  const exportCSV = () => {
    if (!user.history || user.history.length === 0) {
      alert("No attendance history to export!");
      return;
    }

    const headers = "Date,Subject,Faculty,Time Slot,Status\n";
    const csvContent = user.history.map(h => 
      `${h.date},"${h.subject}","${h.faculty}",${h.timeslot},${h.status}`
    ).join("\n");
    
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${user.enrollment}_Attendance_Export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%', maxWidth: '500px', padding: '2rem',
        margin: '1rem', position: 'relative', overflowY: 'auto', maxHeight: '90vh'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent',
          border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
        }}>
          <X size={24} />
        </button>

        <h2 className="title" style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Settings</h2>

        {/* Profile Card */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', background: 'var(--bg-color)', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--card-border)' }}>
          <div style={{ padding: '1rem', background: 'var(--primary-hover)15', backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', borderRadius: '50%' }}>
            <User size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{user.name}</h3>
            <p className="subtitle" style={{ fontSize: '0.9rem' }}>{user.enrollment}</p>
          </div>
        </div>

        {/* Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-color)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {darkMode ? <Sun size={20} color="var(--warning)" /> : <Moon size={20} color="var(--primary)" />}
              <span style={{ fontWeight: 500 }}>Dark Mode</span>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} style={{ cursor: 'pointer', width: '18px', height: '18px' }} />
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-color)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Bell size={20} color="var(--success)" />
              <span style={{ fontWeight: 500 }}>Daily Notifications</span>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" checked={notificationsEnabled} onChange={toggleNotifications} style={{ cursor: 'pointer', width: '18px', height: '18px' }} />
            </label>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'var(--bg-color)', 
            borderRadius: '12px', border: '1px solid var(--card-border)', color: 'var(--text-main)', 
            cursor: 'not-allowed', opacity: 0.7, fontFamily: 'inherit', fontWeight: 500, textAlign: 'left'
          }}>
            <Lock size={20} />
            Change Password (Disabled)
          </button>

          <button onClick={exportCSV} className="btn-primary" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1rem'
          }}>
            <Download size={20} />
            Export Attendance (CSV)
          </button>
        </div>

        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={14} />
          Last synced: {lastUpdated ? lastUpdated : 'Just now'}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
