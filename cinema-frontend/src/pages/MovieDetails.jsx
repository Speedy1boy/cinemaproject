import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Chip, CircularProgress, Alert, Button } from '@mui/material';
import { Clock, Calendar, MapPin, Tag, ArrowLeft } from 'lucide-react';
import api from '../api/axiosConfig';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [movieRes, sessionsRes] = await Promise.all([
          api.get(`/movies/${id}`),
          api.get(`/sessions/movie/${id}`)
        ]);
        setMovie(movieRes.data);
        setSessions(sessionsRes.data);
      } catch (err) {
        setError('Не удалось загрузить данные. Попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, bgcolor: 'background.default', transition: 'background-color 0.3s ease' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, bgcolor: 'background.default', transition: 'background-color 0.3s ease' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!movie) return null;

  return (
    <Box sx={{ bgcolor: 'background.default', flexGrow: 1, transition: 'background-color 0.3s ease' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button 
          startIcon={<ArrowLeft size={20} />} 
          onClick={() => navigate('/')}
          sx={{ 
            mb: 4, 
            color: 'text.secondary',
            transition: 'color 0.3s ease',
            '&:hover': { color: 'text.primary', bgcolor: 'transparent' }
          }}
        >
          Назад к афише
        </Button>

        {/* Информация о фильме */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" fontWeight={700} color="text.primary" sx={{ mb: 1.5, transition: 'color 0.3s ease' }}>
            {movie.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Chip 
              icon={<Tag size={16} />} 
              label={movie.genre} 
              variant="outlined" 
              size="small"
              sx={{ 
                borderRadius: '8px', 
                color: 'text.secondary', 
                borderColor: 'divider', 
                transition: 'color 0.3s ease, border-color 0.3s ease',
                '& .MuiChip-icon': { 
                  color: 'text.secondary', 
                  transition: 'color 0.3s ease' 
                }
              }}
            />
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'text.secondary', transition: 'color 0.3s ease' }}>
              <Clock size={16} style={{ flexShrink: 0 }} />
              <Typography variant="body2" sx={{ lineHeight: '16px', transition: 'color 0.3s ease' }}>
                {movie.duration} мин.
              </Typography>
            </Box>

            <Chip 
              label={movie.ageRating} 
              size="small"
              sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600, borderRadius: '8px' }}
            />
          </Box>

          {movie.description && (
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '800px', lineHeight: 1.7, transition: 'color 0.3s ease' }}>
              {movie.description}
            </Typography>
          )}
        </Box>

        {/* Список сеансов */}
        <Typography variant="h5" fontWeight={700} color="text.primary" sx={{ mb: 3, transition: 'color 0.3s ease' }}>
          Расписание сеансов
        </Typography>

        {sessions.length === 0 ? (
          <Box sx={{ 
            p: 4, 
            bgcolor: 'background.paper', 
            borderRadius: '12px', 
            border: '1px solid', 
            borderColor: 'divider',
            textAlign: 'center',
            transition: 'background-color 0.3s ease, border-color 0.3s ease'
          }}>
            <Typography color="text.secondary" sx={{ transition: 'color 0.3s ease' }}>
              На данный момент сеансов для этого фильма нет
            </Typography>
          </Box>
        ) : (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '16px',
          }}>
            {sessions.map((session) => (
              <Box
                key={session.id}
                onClick={() => navigate(`/session/${session.id}/seats`, { state: { session } })}
                sx={{
                  p: 3,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s, background-color 0.3s ease, border-color 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    borderColor: 'primary.main',
                  },
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', mb: 1, color: 'text.secondary', transition: 'color 0.3s ease' }}>
                      <Calendar size={16} style={{ flexShrink: 0 }} />
                      <Typography variant="body2" sx={{ lineHeight: '16px', transition: 'color 0.3s ease' }}>{formatDate(session.startTime)}</Typography>
                    </Box>
                    <Typography variant="h5" fontWeight={700} color="text.primary" sx={{ transition: 'color 0.3s ease' }}>
                      {formatTime(session.startTime)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'text.secondary', transition: 'color 0.3s ease' }}>
                    <MapPin size={16} style={{ flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ lineHeight: '16px', transition: 'color 0.3s ease' }}>{session.cinemaHall?.name || 'Зал'}</Typography>
                  </Box>

                  <Typography variant="h6" fontWeight={600} color="primary.main" sx={{ transition: 'color 0.3s ease' }}>
                    {session.price ? `${session.price} ₽` : 'Бесплатно'}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}