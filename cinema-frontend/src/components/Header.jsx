import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import { Popcorn, Sun, Moon, LogIn, LogOut, Ticket, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header({ mode, toggleTheme, isAuthenticated, username, role, onLogout }) {
  const isAdmin = role === 'ADMIN';

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
      <Toolbar sx={{ 
        justifyContent: 'space-between', 
        maxWidth: '1200px', 
        width: '100%', 
        margin: '0 auto', 
        minHeight: { xs: 60, sm: 70 }, 
        height: { xs: 60, sm: 70 },
        px: { xs: 1.5, sm: 2 },
        gap: 1,
      }}>
        <Box 
          component={Link} 
          to={isAdmin ? "/admin" : "/"} 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            textDecoration: 'none', 
            color: 'primary.main',
            minWidth: 0,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <Popcorn size={24} />
          </Box>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            alignItems: 'center', 
            columnGap: '6px',
            rowGap: 0,
            lineHeight: 1.1,
          }}>
            <Typography 
              component="span"
              sx={{ 
                fontSize: { xs: '1.1rem', sm: '1.25rem' }, 
                fontWeight: 700, 
                transition: 'color 0.3s ease',
                lineHeight: 1.2,
              }}
            >
              Naumen
            </Typography>
            <Box sx={{ position: 'relative', display: 'inline-block', pr: '4px' }}>
              <Typography 
                component="span"
                sx={{ 
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }, 
                  fontWeight: 700, 
                  transition: 'color 0.3s ease',
                  lineHeight: 1.2,
                }}
              >
                Cinema
              </Typography>
              {isAdmin && (
                <Typography 
                  sx={{ 
                    position: 'absolute', 
                    bottom: -6, 
                    right: -8, 
                    fontSize: '0.5rem', 
                    fontWeight: 800, 
                    bgcolor: 'primary.main', 
                    color: 'white', 
                    borderRadius: '4px', 
                    px: '4px', 
                    py: '1px',
                    lineHeight: 1,
                    letterSpacing: '0.5px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    transition: 'background-color 0.3s ease'
                  }}
                >
                  ADMIN
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 }, flexShrink: 0 }}>
          {isAuthenticated && !isAdmin && (
            <>
              <IconButton 
                component={Link} 
                to="/bookings" 
                sx={{ display: { xs: 'inline-flex', sm: 'none' }, color: 'text.secondary' }}
              >
                <Ticket size={20} />
              </IconButton>
              <Button 
                variant="text" 
                component={Link} 
                to="/bookings"
                startIcon={<Ticket size={20} />}
                sx={{ 
                  display: { xs: 'none', sm: 'inline-flex' },
                  fontSize: '0.9rem', 
                  color: 'text.secondary',
                  transition: 'color 0.2s',
                  '&:hover': { color: 'primary.main', bgcolor: 'transparent' }
                }}
              >
                Мои билеты
              </Button>
            </>
          )}

          {isAuthenticated && isAdmin && (
            <>
              <IconButton 
                component={Link} 
                to="/admin"
                sx={{ display: { xs: 'inline-flex', sm: 'none' }, color: 'text.secondary' }}
              >
                <Shield size={20} />
              </IconButton>
              <Button 
                variant="text" 
                component={Link} 
                to="/admin"
                startIcon={<Shield size={20} />}
                sx={{ 
                  display: { xs: 'none', sm: 'inline-flex' },
                  fontSize: '0.9rem', 
                  color: 'text.secondary',
                  transition: 'color 0.2s',
                  '&:hover': { color: 'primary.main', bgcolor: 'transparent' }
                }}
              >
                Панель
              </Button>
            </>
          )}

          {isAuthenticated && username && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{
                width: { xs: 26, sm: 28 },
                height: { xs: 26, sm: 28 },
                borderRadius: '50%',
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.3s ease'
              }}>
                <Typography sx={{ fontSize: { xs: '12px', sm: '14px' }, fontWeight: 700, color: 'white', lineHeight: 1 }}>
                  {username.charAt(0).toUpperCase()}
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ display: { xs: 'none', md: 'inline' }, transition: 'color 0.3s ease' }}>
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
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              transition: 'background-color 0.2s, border-color 0.2s, color 0.2s',
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </IconButton>
          
          {isAuthenticated ? (
            <>
              <IconButton 
                onClick={onLogout} 
                sx={{ 
                  display: { xs: 'inline-flex', sm: 'none' }, 
                  bgcolor: 'primary.main',
                  color: 'white',
                  borderRadius: '8px',
                  width: 36, 
                  height: 36,
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                <LogOut size={18} />
              </IconButton>
              <Button 
                variant="contained" 
                onClick={onLogout}
                startIcon={<LogOut size={20} />}
                sx={{ 
                  display: { xs: 'none', sm: 'inline-flex' }, 
                  fontSize: '0.9rem', 
                  transition: 'background-color 0.2s', 
                  height: 40, 
                  px: 2 
                }}
              >
                Выйти
              </Button>
            </>
          ) : (
            <>
              <IconButton 
                component={Link}
                to="/login"
                sx={{ 
                  display: { xs: 'inline-flex', sm: 'none' }, 
                  bgcolor: 'primary.main',
                  color: 'white',
                  borderRadius: '8px',
                  width: 36, 
                  height: 36,
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                <LogIn size={18} />
              </IconButton>
              <Button 
                variant="contained" 
                component={Link} 
                to="/login"
                startIcon={<LogIn size={20} />}
                sx={{ 
                  display: { xs: 'none', sm: 'inline-flex' },
                  py: '10px', 
                  px: '16px', 
                  fontSize: '0.9rem', 
                  borderRadius: '8px', 
                  transition: 'background-color 0.2s',
                  height: 40
                }}
              >
                Войти
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}