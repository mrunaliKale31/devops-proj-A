import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, LogOut, Moon, Sun } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Layout = ({ children }) => {
  const { user, darkMode, toggleDarkMode, logout } = useAppContext();

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
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              padding: '1rem',
              borderRadius: '12px',
              textDecoration: 'none',
              color: isActive ? 'var(--primary)' : 'var(--text-main)',
              background: isActive ? 'var(--primary-hover)15' : 'transparent',
              backgroundColor: isActive ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
              fontWeight: isActive ? 600 : 500,
              transition: 'var(--transition)'
            })}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          <NavLink 
            to="/timetable" 
            style={({ isActive }) => ({
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              padding: '1rem',
              borderRadius: '12px',
              textDecoration: 'none',
              color: isActive ? 'var(--primary)' : 'var(--text-main)',
              background: isActive ? 'var(--primary-hover)15' : 'transparent',
              backgroundColor: isActive ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
              fontWeight: isActive ? 600 : 500,
              transition: 'var(--transition)'
            })}
          >
            <CalendarDays size={20} />
            Timetable
          </NavLink>
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            padding: '1rem',
            background: 'var(--card-bg)',
            borderRadius: '12px',
            border: '1px solid var(--card-border)'
          }}>
            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</p>
            <p className="subtitle" style={{ fontSize: '0.8rem' }}>{user.enrollment}</p>
          </div>

          <button 
            onClick={toggleDarkMode}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              cursor: 'pointer',
              borderRadius: '12px',
              justifyContent: 'flex-start',
              fontFamily: 'inherit',
              fontWeight: 500,
              transition: 'var(--transition)'
            }}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>

          <button 
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              background: 'transparent',
              border: 'none',
              color: 'var(--danger)',
              cursor: 'pointer',
              borderRadius: '12px',
              justifyContent: 'flex-start',
              fontFamily: 'inherit',
              fontWeight: 500,
              transition: 'var(--transition)'
            }}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
