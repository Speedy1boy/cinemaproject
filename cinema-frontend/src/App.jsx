import { useState, useMemo, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { getTheme } from './theme';

import Header from './components/Header';
import Home from './pages/Home';

function App() {
  const getInitialMode = () => {
    const savedMode = localStorage.getItem('app-theme');
    if (savedMode) {
      return savedMode;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  };

  const [mode, setMode] = useState(getInitialMode);

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('app-theme', newMode);
      return newMode;
    });
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      if (!localStorage.getItem('app-theme')) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header mode={mode} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<div>Страница авторизации (TODO)</div>} />
          <Route path="/movie/:id" element={<div>Страница фильма (TODO)</div>} />
        </Routes>
      </Box>
    </ThemeProvider>
  );
}

export default App;