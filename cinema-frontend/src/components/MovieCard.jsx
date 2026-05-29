import { Box, Typography, Button, Stack, Card, alpha, useTheme } from '@mui/material';
import { Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MovieCard({ movie }) {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Card 
      elevation={0}
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s, background-color 0.3s ease, border-color 0.3s ease',
        '&:hover': { 
          transform: 'translateY(-4px)', 
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
        },
      }}
    >
      <Box sx={{
        height: '360px',
        bgcolor: 'divider',
        transition: 'background-color 0.3s ease',
        backgroundImage: `url(${movie.poster})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}>
        <Box sx={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          bgcolor: alpha(theme.palette.common.black, 0.75),
          color: theme.palette.common.white,
          px: '8px',
          py: '4px',
          borderRadius: '6px',
          fontSize: '0.75rem',
          fontWeight: 700,
          backdropFilter: 'blur(4px)',
        }}>
          {movie.ageRating}
        </Box>
      </Box>

      <Box sx={{ p: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, mb: '4px', color: 'text.primary' }}>
          {movie.title}
        </Typography>
        <Typography sx={{ fontSize: '0.85rem', mb: '16px', color: 'text.secondary' }}>
          {movie.genre}
        </Typography>

        <Box sx={{ mt: 'auto' }}>
          <Stack direction="row" spacing={'16px'} sx={{ color: 'text.secondary' }}>
            <Stack direction="row" alignItems="center" spacing={'6px'}>
              <Clock size={20} />
              <Typography sx={{ fontSize: '0.85rem', color: 'inherit' }}>{movie.duration} мин</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={'6px'}>
              <Star size={20} />
              <Typography sx={{ fontSize: '0.85rem', color: 'inherit' }}>{movie.rating}</Typography>
            </Stack>
          </Stack>

          <Button 
            variant="outlined" 
            fullWidth 
            sx={{ 
              mt: '16px', 
              py: '10px', 
              px: '16px',
              fontSize: '0.9rem', 
              color: 'text.primary', 
              borderColor: 'divider',
              transition: 'all 0.2s',
              '&:hover': { 
                borderColor: 'primary.main', 
                color: 'primary.main', 
                bgcolor: 'transparent' 
              }
            }}
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            Расписание сеансов
          </Button>
        </Box>
      </Box>
    </Card>
  );
}