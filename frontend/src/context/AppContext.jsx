import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Initialize Theme
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !darkMode ? 'dark' : 'light';
    setDarkMode(!darkMode);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:9091/api/attendance');
      if (!res.ok) throw new Error('Network response was not ok');
      const studentRecords = await res.json();
      setData(studentRecords);
      setLastUpdated(new Date().toLocaleString());
      
      // Auto-update logged in user state
      const savedEnroll = localStorage.getItem('userEnrollment');
      if (savedEnroll && studentRecords && studentRecords[savedEnroll]) {
        setUser(studentRecords[savedEnroll]);
      }
    } catch (err) {
      console.error('Failed to load initial data');
    } finally {
      setLoading(false);
    }
  };

  // Initial Fetch Excel Data
  useEffect(() => {
    loadData();
    const intervalId = setInterval(() => {
      loadData();
    }, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const refreshData = async () => {
    await loadData();
  };

  const login = (enrollment, phone) => {
    if (!data) return { success: false, message: 'Data not loaded yet' };
    
    // Normalize case
    const uId = Object.keys(data).find(k => k.toLowerCase() === enrollment.toLowerCase());
    if (uId) {
      const student = data[uId];
      if (student.phone === phone) {
        setUser(student);
        localStorage.setItem('userEnrollment', uId);
        return { success: true };
      }
      return { success: false, message: 'Invalid phone number (password)' };
    }
    return { success: false, message: 'Enrollment number not found' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userEnrollment');
  };

  return (
    <AppContext.Provider value={{
      data,
      user,
      loading,
      darkMode,
      toggleDarkMode,
      notificationsEnabled,
      toggleNotifications,
      lastUpdated,
      refreshData,
      login,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
