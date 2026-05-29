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
      styleOverrides: `
        body {
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }
        .MuiAlert-root {
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px ${mode === 'light' ? '#ffffff' : '#1e293b'} inset !important;
          -webkit-text-fill-color: ${mode === 'light' ? '#0f172a' : '#f8fafc'} !important;
          caret-color: ${mode === 'light' ? '#0f172a' : '#f8fafc'} !important;
          border: none !important;
          outline: none !important;
          border-radius: 0 !important;
          transition: background-color 5000s ease-in-out 0s, box-shadow 0.3s ease, -webkit-text-fill-color 0.3s ease;
        }
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none !important;
        }
      `,
    },
  },
});