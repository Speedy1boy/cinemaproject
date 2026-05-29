import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import api from '../api/axiosConfig';

export default function SeatSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const session = location.state?.session;

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [booking, setBooking] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Генерация зала на основе данных сеанса (если данных нет, ставим 50 по умолчанию)
  const seatsPerRow = 10;
  const totalSeats = session?.cinemaHall?.totalSeats || 50;
  const rows = Math.ceil(totalSeats / seatsPerRow);
  const price = session?.price || 0;

  // Временная заглушка: случайно отмечаем 20% мест как занятые
  const bookedSeats = useMemo(() => {
    const booked = new Set();
    for (let i = 0; i < totalSeats * 0.2; i++) {
      booked.add(Math.floor(Math.random() * totalSeats) + 1);
    }
    return booked;
  }, [totalSeats]);

  if (!session) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, bgcolor: 'background.default' }}>
        <Alert severity="error">Сеанс не найден. Вернитесь на страницу фильма.</Alert>
      </Box>
    );
  }

  const handleSeatClick = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };

  const handleBooking = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setNotification({ open: true, message: 'Для бронирования необходимо авторизоваться', severity: 'warning' });
      return;
    }

    setBooking(true);
    try {
      // Отправляем запрос на бронь для каждого выбранного места
            await Promise.all(
        selectedSeats.map((seatId) =>
          api.post('/bookings', { sessionId: session.id, seatId: seatId })
        )
      );
      
      // Переход на страницу успешного бронирования с передачей данных
      navigate('/booking/success', {
        state: {
          movie: session.movie,
          startTime: session.startTime,
          cinemaHall: session.cinemaHall,
          selectedSeats: selectedSeats,
          totalPrice: price * selectedSeats.length
        }
      });
    } catch (err) {
      setNotification({ 
        open: true, 
        message: err.response?.data?.message || 'Ошибка при бронировании', 
        severity: 'error' 
      });
    } finally {
      setBooking(false);
    }
  };

  const formatTime = (isoString) => new Date(isoString).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const formatDate = (isoString) => new Date(isoString).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

  return (
    <Box sx={{ bgcolor: 'background.default', flexGrow: 1, transition: 'background-color 0.3s ease', pb: 12 }}>
      <Container maxWidth="md" sx={{ pt: 4 }}>
        <Button 
          startIcon={<ArrowLeft size={20} />} 
          onClick={() => navigate(-1)}
          sx={{ mb: 3, color: 'text.secondary', transition: 'color 0.3s ease', '&:hover': { bgcolor: 'transparent', color: 'text.primary' } }}
        >
          Назад
        </Button>

        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight={700} color="text.primary" sx={{ transition: 'color 0.3s ease' }}>
            {session.movie?.title || 'Фильм'}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, transition: 'color 0.3s ease' }}>
            {formatDate(session.startTime)}, {formatTime(session.startTime)} • {session.cinemaHall?.name || 'Зал'}
          </Typography>
        </Box>

        {/* Экран */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
          <Box sx={{
            width: '80%',
            height: '30px',
            bgcolor: 'divider',
            borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.3s ease'
          }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ transition: 'color 0.3s ease' }}>
              ЭКРАН
            </Typography>
          </Box>
        </Box>

        {/* Схема мест */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <Box key={rowIndex} sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Typography variant="body2" sx={{ width: 20, textAlign: 'center', color: 'text.secondary', transition: 'color 0.3s ease' }}>
                {rowIndex + 1}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                {Array.from({ length: seatsPerRow }).map((_, seatIndex) => {
                  const seatId = rowIndex * seatsPerRow + seatIndex + 1;
                  if (seatId > totalSeats) return <Box key={seatId} sx={{ width: 36, height: 36 }} />;
                  
                  const isBooked = bookedSeats.has(seatId);
                  const isSelected = selectedSeats.includes(seatId);
                  
                  // Проходы после 3-го и 7-го места
                  const ml = seatIndex === 3 || seatIndex === 7 ? '12px' : '0';

                  return (
                    <Box
                      key={seatId}
                      onClick={() => !isBooked && handleSeatClick(seatId)}
                      sx={{
                        width: 36,
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: isBooked ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        ml: ml,
                        ...(isBooked ? {
                          bgcolor: 'action.disabledBackground',
                          color: 'action.disabled',
                        } : isSelected ? {
                          bgcolor: 'primary.main',
                          color: 'white',
                          transform: 'scale(1.1)',
                          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
                        } : {
                          bgcolor: 'background.paper',
                          color: 'text.secondary',
                          border: '1px solid',
                          borderColor: 'divider',
                          '&:hover': {
                            bgcolor: 'primary.light',
                            color: 'primary.main',
                            borderColor: 'primary.main',
                            transform: 'scale(1.1)',
                          }
                        })
                      }}
                    >
                      {seatIndex + 1}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Легенда */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 5, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 20, height: 20, borderRadius: '4px', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', transition: 'background-color 0.3s ease, border-color 0.3s ease' }} />
            <Typography variant="body2" color="text.secondary" sx={{ transition: 'color 0.3s ease' }}>Свободно</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 20, height: 20, borderRadius: '4px', bgcolor: 'primary.main' }} />
            <Typography variant="body2" color="text.secondary" sx={{ transition: 'color 0.3s ease' }}>Выбрано</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 20, height: 20, borderRadius: '4px', bgcolor: 'action.disabledBackground' }} />
            <Typography variant="body2" color="text.secondary" sx={{ transition: 'color 0.3s ease' }}>Занято</Typography>
          </Box>
        </Box>
      </Container>

      {/* Панель бронирования снизу */}
      <Box sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(10px)',
        p: 2,
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
        zIndex: 1000
      }}>
        <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ transition: 'color 0.3s ease' }}>
              {selectedSeats.length > 0 ? `Выбрано: ${selectedSeats.length} мес.` : 'Выберите места'}
            </Typography>
            <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ transition: 'color 0.3s ease' }}>
              {selectedSeats.length > 0 ? `${(price * selectedSeats.length).toLocaleString('ru-RU')} ₽` : '—'}
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            disabled={selectedSeats.length === 0 || booking}
            onClick={handleBooking}
            sx={{ py: 1.5, px: 6, borderRadius: '12px' }}
          >
            {booking ? <CircularProgress size={24} color="inherit" /> : 'Забронировать'}
          </Button>
        </Container>
      </Box>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={4000} 
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}