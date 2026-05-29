import { useState, useEffect } from 'react';
import { Box, Container, Typography, CircularProgress, Alert, Chip, Button } from '@mui/material';
import { Calendar, Clock, MapPin, Ticket, ArrowLeft, Armchair } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const statusMap = {
  CONFIRMED: { label: 'Подтверждено', color: 'success' },
  PENDING: { label: 'Ожидает', color: 'warning' },
  CANCELLED: { label: 'Отменено', color: 'error' },
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings/my');
        setBookings(res.data);
      } catch (err) {
        setError('Не удалось загрузить бронирования. Возможно, вы не авторизованы.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const formatTime = (isoString) => new Date(isoString).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const formatDate = (isoString) => new Date(isoString).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, bgcolor: 'background.default', transition: 'background-color 0.3s ease' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', flexGrow: 1, transition: 'background-color 0.3s ease', py: 4 }}>
      <Container maxWidth="md">
        <Button 
          startIcon={<ArrowLeft size={20} />} 
          onClick={() => navigate('/')}
          sx={{ mb: 4, color: 'text.secondary', transition: 'color 0.3s ease', '&:hover': { bgcolor: 'transparent', color: 'text.primary' } }}
        >
          На главную
        </Button>

        <Typography variant="h4" fontWeight={700} color="text.primary" sx={{ mb: 4, transition: 'color 0.3s ease' }}>
          Мои билеты
        </Typography>

        {error ? (
          <Alert severity="error" sx={{ transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease' }}>{error}</Alert>
        ) : bookings.length === 0 ? (
          <Box sx={{ 
            p: 4, 
            bgcolor: 'background.paper', 
            borderRadius: '12px', 
            border: '1px solid', 
            borderColor: 'divider',
            textAlign: 'center',
            transition: 'background-color 0.3s ease, border-color 0.3s ease'
          }}>
            <Typography color="text.secondary" sx={{ mb: 2, transition: 'color 0.3s ease' }}>
              У вас пока нет бронирований
            </Typography>
            <Button variant="contained" onClick={() => navigate('/')} sx={{ borderRadius: '12px' }}>
              Выбрать фильм
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {bookings.map((booking) => {
              const status = statusMap[booking.status] || { label: booking.status, color: 'default' };
              return (
                <Box 
                  key={booking.id}
                  sx={{ 
                    p: 3, 
                    bgcolor: 'background.paper', 
                    borderRadius: '12px', 
                    border: '1px solid', 
                    borderColor: 'divider',
                    transition: 'background-color 0.3s ease, border-color 0.3s ease, transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 10px rgb(0 0 0 / 0.05)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ transition: 'color 0.3s ease' }}>
                      {booking.session?.movie?.title || 'Фильм'}
                    </Typography>
                    <Chip 
                      label={status.label} 
                      color={status.color} 
                      size="small" 
                      sx={{ borderRadius: '8px', fontWeight: 600 }} 
                    />
                  </Box>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5, color: 'text.secondary', transition: 'color 0.3s ease' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={16} style={{ flexShrink: 0 }} />
                      <Typography variant="body2" sx={{ lineHeight: '16px', transition: 'color 0.3s ease' }}>
                        {formatDate(booking.session?.startTime)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={16} style={{ flexShrink: 0 }} />
                      <Typography variant="body2" sx={{ lineHeight: '16px', transition: 'color 0.3s ease' }}>
                        {formatTime(booking.session?.startTime)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={16} style={{ flexShrink: 0 }} />
                      <Typography variant="body2" sx={{ lineHeight: '16px', transition: 'color 0.3s ease' }}>
                        {booking.session?.cinemaHall?.name || 'Зал'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Armchair size={16} style={{ flexShrink: 0 }} />
                      <Typography variant="body2" sx={{ lineHeight: '16px', transition: 'color 0.3s ease' }}>
                        Ряд {booking.seat?.rowNumber}, Место {booking.seat?.seatNumber}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Container>
    </Box>
  );
}