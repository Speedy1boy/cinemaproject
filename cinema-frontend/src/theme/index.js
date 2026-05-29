import { createTheme } from '@mui/material';

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#4f46e5',
    },
    background: {
      default: mode === 'light' ? '#f8fafc' : '#0f172a',
      paper: mode === 'light' ? '#ffffff' : '#1e293b',
    },
    text: {
      primary: mode === 'light' ? '#0f172a' : '#f8fafc',
      secondary: mode === 'light' ? '#64748b' : '#94a3b8',
    },
    divider: mode === 'light' ? '#e2e8f0' : '#334155',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease',
        },
      },
    },
  },
});