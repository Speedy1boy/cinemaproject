import { useState, useMemo, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { getTheme } from './theme';

import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieDetails from './pages/MovieDetails';
import SeatSelection from './pages/SeatSelection';
import BookingSuccess from './pages/BookingSuccess';
import MyBookings from './pages/MyBookings';
import AdminPanel from './pages/AdminPanel';

function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token || role !== 'ADMIN') return <Navigate to="/" replace />;
  return children;
}

function PublicUserRoute({ children }) {
  const role = localStorage.getItem('role');
  if (role === 'ADMIN') return <Navigate to="/admin" replace />;
  return children;
}

function ProtectedUserRoute({ children }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token) return <Navigate to="/login" replace />;
  if (role === 'ADMIN') return <Navigate to="/admin" replace />;
  return children;
}

function App() {
  const getInitialMode = () => {
    const savedMode = localStorage.getItem('app-theme');
    if (savedMode) return savedMode;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  };

  const [mode, setMode] = useState(getInitialMode);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || 'USER');

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('app-theme', newMode);
      return newMode;
    });
  };

  const handleLogin = (uname, r) => {
    setIsAuthenticated(true);
    setUsername(uname);
    setRole(r);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setUsername('');
    setRole('USER');
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('app-theme')) setMode(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header 
          mode={mode} 
          toggleTheme={toggleTheme} 
          isAuthenticated={isAuthenticated} 
          username={username}
          role={role}
          onLogout={handleLogout} 
        />
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          } />
          <Route path="/" element={<PublicUserRoute><Home /></PublicUserRoute>} />
          <Route path="/movie/:id" element={<PublicUserRoute><MovieDetails /></PublicUserRoute>} />
          <Route path="/session/:sessionId/seats" element={<PublicUserRoute><SeatSelection /></PublicUserRoute>} />
          <Route path="/booking/success" element={<PublicUserRoute><BookingSuccess /></PublicUserRoute>} />
          <Route path="/bookings" element={
            <ProtectedUserRoute>
              <MyBookings />
            </ProtectedUserRoute>
          } />
        </Routes>
      </Box>
    </ThemeProvider>
  );
}

export default App;