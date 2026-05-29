import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import { Popcorn, Sun, Moon, LogIn, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header({ mode, toggleTheme, isAuthenticated, onLogout }) {
  return (
    <AppBar 
      position="sticky" 
      color="inherit" 
      elevation={0} 
      sx={{ 
        bgcolor: 'background.paper',
        borderBottom: '1px solid', 
        borderColor: 'divider',
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', maxWidth: '1200px', width: '100%', margin: '0 auto', minHeight: 70, height: 70 }}>
        <Box 
          component={Link} 
          to="/" 
          sx={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'primary.main', fontSize: '1.25rem', fontWeight: 700 }}
        >
          <Popcorn size={24} />
          <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>NaumenCinema</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <IconButton 
            onClick={toggleTheme} 
            sx={{ 
              border: '1px solid', 
              borderColor: 'divider', 
              borderRadius: '6px',
              color: 'text.primary',
              transition: 'background-color 0.2s, border-color 0.2s, color 0.2s',
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            {mode === 'light' ? <Moon size={24} /> : <Sun size={24} />}
          </IconButton>
          
          {isAuthenticated ? (
            <Button 
              variant="contained" 
              onClick={onLogout}
              startIcon={<LogOut size={24} />}
              sx={{ py: '10px', px: '16px', fontSize: '0.9rem', transition: 'background-color 0.2s' }}
            >
              Выйти
            </Button>
          ) : (
            <Button 
              variant="contained" 
              component={Link} 
              to="/login"
              startIcon={<LogIn size={24} />}
              sx={{ py: '10px', px: '16px', fontSize: '0.9rem', transition: 'background-color 0.2s' }}
            >
              Войти
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}