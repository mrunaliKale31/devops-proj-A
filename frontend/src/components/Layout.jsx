import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, LogOut, Settings, HelpCircle, RefreshCw } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import SettingsModal from './SettingsModal';
import LiveClock from './LiveClock';

const Layout = ({ children }) => {
  const { user, logout, refreshData } = useAppContext();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside style={{
        width: '280px',
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--card-border)',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(20px)',
        zIndex: 10
      }}>
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>
            MIT-ADT Tracker
          </h2>
          <p className="subtitle" style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>
            School of Computing (IT CORE)
          </p>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavLink 
            to="/" 
            end
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1rem', borderRadius: '12px', textDecoration: 'none',
              color: isActive ? 'var(--primary)' : 'var(--text-main)',
              background: isActive ? 'var(--primary-hover)15' : 'transparent',
              backgroundColor: isActive ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
              fontWeight: isActive ? 600 : 500, transition: 'var(--transition)'
            })}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          <NavLink 
            to="/timetable" 
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1rem', borderRadius: '12px', textDecoration: 'none',
              color: isActive ? 'var(--primary)' : 'var(--text-main)',
              background: isActive ? 'var(--primary-hover)15' : 'transparent',
              backgroundColor: isActive ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
              fontWeight: isActive ? 600 : 500, transition: 'var(--transition)'
            })}
          >
            <CalendarDays size={20} />
            Timetable
          </NavLink>
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* User Widget */}
          <div style={{
            padding: '1rem', background: 'var(--card-bg)', borderRadius: '12px',
            border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</p>
              <p className="subtitle" style={{ fontSize: '0.8rem' }}>{user.enrollment}</p>
            </div>
            <button onClick={() => setIsSettingsOpen(true)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'var(--transition)', padding: '0.25rem' }}>
              <Settings size={20} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={handleRefresh}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                padding: '0.75rem', background: 'var(--bg-color)', border: '1px solid var(--card-border)',
                color: 'var(--primary)', cursor: 'pointer', borderRadius: '12px',
                fontFamily: 'inherit', fontWeight: 500, transition: 'var(--transition)'
              }}
            >
              <RefreshCw size={18} style={{ transform: isRefreshing ? 'rotate(180deg)' : 'none', transition: 'transform 0.5s ease' }} />
              Refresh
            </button>
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                padding: '0.75rem', background: 'var(--danger-bg)', border: 'none',
                color: 'var(--danger)', cursor: 'pointer', borderRadius: '12px',
                fontFamily: 'inherit', fontWeight: 500, transition: 'var(--transition)'
              }}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="main-content" style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
        <LiveClock />
        <div style={{ flex: 1, padding: '1rem' }}>
          {children}
        </div>

        {/* Floating Help */}
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 50
        }} title="Need help? Contact Admin">
          <button style={{
            width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary)',
            color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)', cursor: 'pointer', transition: 'var(--transition)'
          }}>
            <HelpCircle size={24} />
          </button>
        </div>
      </main>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="glass-panel animate-fade-in" style={{ padding: '2rem', textAlign: 'center', maxWidth: '300px' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Sign Out?</h3>
            <p className="subtitle" style={{ marginBottom: '2rem' }}>Are you sure you want to log out from securely synced session?</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => setShowLogoutConfirm(false)} 
                style={{ flex: 1, padding: '0.75rem', background: 'var(--bg-color)', border: '1px solid var(--card-border)', borderRadius: '8px', cursor: 'pointer' }}
              >Cancel</button>
              <button 
                onClick={logout}
                style={{ flex: 1, padding: '0.75rem', background: 'var(--danger)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
