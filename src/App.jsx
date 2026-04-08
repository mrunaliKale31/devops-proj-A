import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SubjectDetail from './pages/SubjectDetail';
import Timetable from './pages/Timetable';

// Layout
import Layout from './components/Layout';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAppContext();
  if (loading) return <div className="app-container" style={{alignItems: 'center', justifyContent: 'center'}}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/subject/:subjectName" element={
          <ProtectedRoute>
            <SubjectDetail />
          </ProtectedRoute>
        } />

        <Route path="/timetable" element={
          <ProtectedRoute>
            <Timetable />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
