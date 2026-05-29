import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import { Popcorn, Sun, Moon, LogIn, LogOut, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header({ mode, toggleTheme, isAuthenticated, username, onLogout }) {
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
          <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, transition: 'color 0.3s ease' }}>Naumen Cinema</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
          {isAuthenticated && (
            <Button 
              variant="text" 
              component={Link} 
              to="/bookings"
              sx={{ 
                color: 'text.secondary',
                transition: 'color 0.2s',
                minWidth: { xs: 40, sm: 'auto' },
                height: 40,
                px: { xs: 0, sm: 1.5 },
                '&:hover': { color: 'primary.main', bgcolor: 'transparent' }
              }}
            >
              <Ticket size={20} />
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, ml: 0.75, fontSize: '0.9rem' }}>
                Мои билеты
              </Box>
            </Button>
          )}

          {isAuthenticated && username && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 1 } }}>
              <Box sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.3s ease',
                flexShrink: 0
              }}>
                <Typography sx={{ fontSize: '14px', fontWeight: 700, color: 'white', lineHeight: 1 }}>
                  {username.charAt(0).toUpperCase()}
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                fontWeight={600} 
                color="text.primary" 
                sx={{ 
                  display: { xs: 'none', sm: 'inline' },
                  transition: 'color 0.3s ease',
                  maxWidth: 120,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {username}
              </Typography>
            </Box>
          )}

          <IconButton 
            onClick={toggleTheme} 
            sx={{ 
              border: '1px solid', 
              borderColor: 'divider', 
              borderRadius: '8px',
              color: 'text.primary',
              width: 40,
              height: 40,
              transition: 'background-color 0.2s, border-color 0.2s, color 0.2s',
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </IconButton>
          
          {isAuthenticated ? (
            <Button 
              variant="contained" 
              onClick={onLogout}
              sx={{ 
                fontSize: '0.9rem', 
                transition: 'background-color 0.2s',
                minWidth: { xs: 40, sm: 'auto' },
                height: 40,
                px: { xs: 0, sm: 2 }
              }}
            >
              <LogOut size={20} />
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, ml: 0.75 }}>
                Выйти
              </Box>
            </Button>
          ) : (
            <Button 
              variant="contained" 
              component={Link} 
              to="/login"
              sx={{ 
                fontSize: '0.9rem', 
                transition: 'background-color 0.2s',
                minWidth: { xs: 40, sm: 'auto' },
                height: 40,
                px: { xs: 0, sm: 2 }
              }}
            >
              <LogIn size={20} />
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, ml: 0.75 }}>
                Войти
              </Box>
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}