import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Chip, Divider } from '@mui/material';
import { CheckCircle, Calendar, MapPin, Clock, Ticket, ArrowLeft } from 'lucide-react';

export default function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  if (!bookingData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, bgcolor: 'background.default', transition: 'background-color 0.3s ease' }}>
        <Typography color="text.primary">Данные бронирования не найдены</Typography>
      </Box>
    );
  }

  const { movie, startTime, cinemaHall, selectedSeats, totalPrice } = bookingData;

  const formatTime = (isoString) => new Date(isoString).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const formatDate = (isoString) => new Date(isoString).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <Box sx={{ bgcolor: 'background.default', flexGrow: 1, transition: 'background-color 0.3s ease', py: 4 }}>
      <Container maxWidth="sm">
        <Button 
          startIcon={<ArrowLeft size={20} />} 
          onClick={() => navigate('/')}
          sx={{ mb: 4, color: 'text.secondary', transition: 'color 0.3s ease', '&:hover': { bgcolor: 'transparent', color: 'text.primary' } }}
        >
          На главную
        </Button>

        <Box sx={{ 
          bgcolor: 'background.paper', 
          borderRadius: '12px', 
          border: '1px solid', 
          borderColor: 'divider',
          overflow: 'hidden',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
        }}>
          {/* Шапка */}
          <Box sx={{ 
            bgcolor: 'primary.main', 
            p: 3, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 1 
          }}>
            <CheckCircle size={48} color="white" />
            <Typography variant="h5" fontWeight={700} color="white">
              Бронирование успешно!
            </Typography>
          </Box>

          {/* Детали */}
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ mb: 2, transition: 'color 0.3s ease' }} align="center">
              {movie?.title || 'Фильм'}
            </Typography>

            <Divider sx={{ mb: 2, borderColor: 'divider', transition: 'border-color 0.3s ease' }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary', transition: 'color 0.3s ease' }}>
                <Calendar size={20} />
                <Typography sx={{ transition: 'color 0.3s ease' }}>{formatDate(startTime)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary', transition: 'color 0.3s ease' }}>
                <Clock size={20} />
                <Typography sx={{ transition: 'color 0.3s ease' }}>{formatTime(startTime)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary', transition: 'color 0.3s ease' }}>
                <MapPin size={20} />
                <Typography sx={{ transition: 'color 0.3s ease' }}>{cinemaHall?.name || 'Зал'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary', transition: 'color 0.3s ease' }}>
                <Ticket size={20} />
                <Typography sx={{ transition: 'color 0.3s ease' }}>
                  Места: {selectedSeats?.sort((a,b) => a-b).join(', ')}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2, borderColor: 'divider', transition: 'border-color 0.3s ease' }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography color="text.secondary" fontWeight={600} sx={{ transition: 'color 0.3s ease' }}>Итого:</Typography>
              <Typography variant="h6" fontWeight={700} color="primary.main" sx={{ transition: 'color 0.3s ease' }}>
                {totalPrice?.toLocaleString('ru-RU')} ₽
              </Typography>
            </Box>
          </Box>

          {/* Кнопки */}
          <Box sx={{ px: 3, pb: 3, display: 'flex', gap: 2 }}>
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={() => navigate('/bookings')}
              sx={{ borderRadius: '12px', py: 1.5, color: 'text.primary', borderColor: 'divider', transition: 'all 0.2s', '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }}
            >
              Мои билеты
            </Button>
            <Button 
              fullWidth 
              variant="contained" 
              onClick={() => navigate('/')}
              sx={{ borderRadius: '12px', py: 1.5 }}
            >
              На главную
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}