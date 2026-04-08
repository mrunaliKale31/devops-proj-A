import React, { createContext, useContext, useState, useEffect } from 'react';
import { parseAttendanceData } from '../utils/excelParser';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

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

  // Fetch Excel Data
  useEffect(() => {
    const loadData = async () => {
      try {
        const studentRecords = await parseAttendanceData('/data/attendance.xlsx');
        setData(studentRecords);
        
        // Auto-login if previously logged in
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
    loadData();
  }, []);

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
      login,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
