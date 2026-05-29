import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, TextField, Button, Stack, InputAdornment, IconButton, Alert, Link } from '@mui/material';
import { Eye, EyeOff } from 'lucide-react';
import api from '../api/axiosConfig';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await api.post('/auth/signup', { username, email, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при регистрации. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  const inputSx = { 
    '& .MuiOutlinedInput-root': { 
      borderRadius: '12px', 
      bgcolor: 'background.paper',
      transition: 'background-color 0.3s ease, border-color 0.3s ease',
      overflow: 'hidden', // Обрезаем всё лишнее по краям
    },
    '& .MuiOutlinedInput-input': { 
      bgcolor: 'transparent !important',
      border: 'none !important',
      borderRadius: '0 !important',
    },
    '& .MuiInputLabel-asterisk': { display: 'none' },
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      flexGrow: 1, 
      bgcolor: 'background.default', 
      transition: 'background-color 0.3s ease',
      py: 4,
    }}>
      <Box sx={{ 
        width: '100%', 
        maxWidth: 400, 
        p: 4, 
        bgcolor: 'background.paper', 
        borderRadius: '12px', 
        border: '1px solid', 
        borderColor: 'divider',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
      }}>
        <Typography variant="h5" fontWeight={700} color="text.primary" align="center" sx={{ mb: 3 }}>
          Регистрация
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3, transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease' }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="Имя пользователя"
              variant="outlined"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={inputSx}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={inputSx}
            />
            <TextField
              fullWidth
              label="Пароль"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={() => setShowPassword(!showPassword)} 
                        edge="end"
                        sx={{ color: 'text.secondary', p: 1 }}
                      >
                        {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              }}
              sx={inputSx}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
              <Button 
                type="submit" 
                variant="contained" 
                size="large"
                disabled={loading}
                sx={{ py: 1.5, px: 6, borderRadius: '12px' }}
              >
                Зарегистрироваться
              </Button>
            </Box>
          </Stack>
        </Box>

        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
          Уже есть аккаунт?{' '}
          <Link component={RouterLink} to="/login" color="primary.main" fontWeight={600} underline="none">
            Войти
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}