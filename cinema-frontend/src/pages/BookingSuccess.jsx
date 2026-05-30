import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Chip } from '@mui/material';
import { Calendar, MapPin, Clock, Ticket, ArrowLeft } from 'lucide-react';

export default function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  if (!bookingData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, bgcolor: 'background.default', transition: 'background-color 0.3s ease' }}>
        <Typography color="text.primary" sx={{ transition: 'color 0.3s ease' }}>Данные бронирования не найдены</Typography>
      </Box>
    );
  }

  const { movie, startTime, cinemaHall, formattedSeats, totalPrice } = bookingData;

  const formatTime = (isoString) => new Date(isoString).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const formatDate = (isoString) => new Date(isoString).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

  const DetailItem = ({ icon, text }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary', transition: 'color 0.3s ease' }}>
      {icon}
      <Typography variant="body1" fontWeight={500} sx={{ transition: 'color 0.3s ease' }}>{text}</Typography>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: 'background.default', flexGrow: 1, transition: 'background-color 0.3s ease', py: 4 }}>
      <Container maxWidth="sm">
        <Button 
          startIcon={<ArrowLeft size={20} />} 
          onClick={() => navigate('/')}
          sx={{ mb: 3, color: 'text.secondary', transition: 'color 0.3s ease', '&:hover': { bgcolor: 'transparent', color: 'text.primary' } }}
        >
          На главную
        </Button>

        {/* Билет */}
        <Box sx={{
          width: '100%',
          bgcolor: 'background.paper',
          borderRadius: '12px',
          border: '1px solid',
          borderColor: 'divider',
          position: 'relative',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
        }}>
          {/* Верхняя часть билета */}
          <Box sx={{ pt: 5, pb: 4, px: 4, textAlign: 'center' }}>
            <Chip 
              label="Бронирование подтверждено" 
              size="small" 
              sx={{ 
                mb: 3, 
                bgcolor: 'primary.main', 
                color: 'white', 
                fontWeight: 600, 
                borderRadius: '6px',
                fontSize: '0.8rem'
              }} 
            />
            <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ transition: 'color 0.3s ease', lineHeight: 1.3 }}>
              {movie?.title || 'Фильм'}
            </Typography>
          </Box>

          {/* Линия отрыва с вырезами */}
          <Box sx={{ position: 'relative', px: 4 }}>
            <Box sx={{ borderTop: '2px dashed', borderColor: 'divider', transition: 'border-color 0.3s ease' }} />
            {/* Левый вырез */}
            <Box sx={{
              position: 'absolute',
              top: -16,
              left: -18,
              width: 32,
              height: 32,
              bgcolor: 'background.default',
              borderRadius: '50%',
              transition: 'background-color 0.3s ease'
            }} />
            {/* Правый вырез */}
            <Box sx={{
              position: 'absolute',
              top: -16,
              right: -18,
              width: 32,
              height: 32,
              bgcolor: 'background.default',
              borderRadius: '50%',
              transition: 'background-color 0.3s ease'
            }} />
          </Box>

          {/* Нижняя часть билета (Детали) */}
          <Box sx={{ pt: 4, pb: 3, px: 4 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 4 }}>
              <DetailItem icon={<Calendar size={20} />} text={formatDate(startTime)} />
              <DetailItem icon={<Clock size={20} />} text={formatTime(startTime)} />
              <DetailItem icon={<MapPin size={20} />} text={cinemaHall?.name || 'Зал'} />
              <DetailItem icon={<Ticket size={20} />} text={formattedSeats || 'Не указаны'} />
            </Box>

            {/* Итого */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              bgcolor: 'action.hover',
              borderRadius: '10px',
              p: 2.5,
              transition: 'background-color 0.3s ease'
            }}>
              <Typography variant="body1" color="text.secondary" fontWeight={600} sx={{ transition: 'color 0.3s ease' }}>
                Итого:
              </Typography>
              <Typography variant="h5" fontWeight={800} color="primary.main" sx={{ transition: 'color 0.3s ease' }}>
                {totalPrice?.toLocaleString('ru-RU')} ₽
              </Typography>
            </Box>
          </Box>

          {/* Кнопки */}
          <Box sx={{ px: 4, pb: 4, pt: 1, display: 'flex', gap: 2 }}>
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={() => navigate('/bookings')}
              sx={{ 
                borderRadius: '10px', 
                py: 1.5, 
                color: 'text.primary', 
                borderColor: 'divider', 
                transition: 'all 0.2s', 
                '&:hover': { borderColor: 'primary.main', color: 'primary.main' } 
              }}
            >
              Мои билеты
            </Button>
            <Button 
              fullWidth 
              variant="contained" 
              onClick={() => navigate('/')}
              sx={{ borderRadius: '10px', py: 1.5 }}
            >
              На главную
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}