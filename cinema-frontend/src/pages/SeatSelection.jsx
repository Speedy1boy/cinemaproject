import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Container, Typography, Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import api from '../api/axiosConfig';

export default function SeatSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId } = useParams();
  
  const session = location.state?.session; 

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchSeats = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/sessions/${sessionId}/seats`);
        setSeats(res.data);
      } catch (err) {
        setNotification({ open: true, message: 'Не удалось загрузить схему зала', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchSeats();
  }, [sessionId]);

  const groupedSeats = useMemo(() => {
    if (!seats.length) return [];
    
    const map = new Map();
    seats.forEach(seat => {
      if (!map.has(seat.rowNumber)) {
        map.set(seat.rowNumber, []);
      }
      map.get(seat.rowNumber).push(seat);
    });

    const sortedRows = Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
    sortedRows.forEach(([_, rowSeats]) => {
      rowSeats.sort((a, b) => a.seatNumber - b.seatNumber);
    });

    return sortedRows;
  }, [seats]);

  const handleSeatClick = (seatId, isAvailable) => {
    if (!isAvailable) return;
    
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
      await Promise.all(
        selectedSeats.map((seatId) =>
          api.post('/bookings', { sessionId: parseInt(sessionId), seatId: seatId })
        )
      );
      
      const formattedSeats = selectedSeats.map(id => {
        const seat = seats.find(s => s.id === id);
        return seat ? `${seat.rowNumber} ряд, ${seat.seatNumber} мес.` : '';
      }).filter(Boolean).join(', ');

      navigate('/booking/success', {
        state: {
          movie: session?.movie,
          startTime: session?.startTime,
          cinemaHall: session?.cinemaHall,
          formattedSeats: formattedSeats,
          totalPrice: (session?.price || 0) * selectedSeats.length
        }
      });
    } catch (err) {
      setNotification({ 
        open: true, 
        message: err.response?.data?.message || 'Ошибка при бронировании. Место могло быть уже занято.', 
        severity: 'error' 
      });
    } finally {
      setBooking(false);
    }
  };

  const formatTime = (isoString) => new Date(isoString).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const formatDate = (isoString) => new Date(isoString).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, bgcolor: 'background.default', transition: 'background-color 0.3s ease' }}>
        <CircularProgress />
      </Box>
    );
  }

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
            {session?.movie?.title || 'Фильм'}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, transition: 'color 0.3s ease' }}>
            {session ? `${formatDate(session.startTime)}, ${formatTime(session.startTime)} • ${session.cinemaHall?.name || 'Зал'}` : 'Загрузка...'}
          </Typography>
        </Box>

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

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
          {groupedSeats.map(([rowNumber, rowSeats]) => (
            <Box key={rowNumber} sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Typography variant="body2" sx={{ width: 20, textAlign: 'center', color: 'text.secondary', transition: 'color 0.3s ease' }}>
                {rowNumber}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                {rowSeats.map((seat) => {
                  const isBooked = !seat.available;
                  const isSelected = selectedSeats.includes(seat.id);
                  
                  return (
                    <Box
                      key={seat.id}
                      onClick={() => handleSeatClick(seat.id, seat.available)}
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
                      {seat.seatNumber}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          ))}
        </Box>

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
              {selectedSeats.length > 0 ? `${((session?.price || 0) * selectedSeats.length).toLocaleString('ru-RU')} ₽` : '—'}
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