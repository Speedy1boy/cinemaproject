import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import { Clapperboard, Sun, Moon, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header({ mode, toggleTheme }) {
    return (
        <AppBar position="sticky" color="inherit" elevation={1} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
            <Toolbar sx={{ justifyContent: 'space-between', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
                
                {/* Логотип */}
                <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'primary.main' }}>
                    <Clapperboard size={24} />
                    <Typography variant="h6" fontWeight="700">NaumenCinema</Typography>
                </Box>

                {/* Действия */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={toggleTheme} color="inherit">
                        {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </IconButton>
                    
                    <Button 
                        variant="contained" 
                        component={Link} 
                        to="/login"
                        startIcon={<LogIn size={18} />}
                    >
                        Войти
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}