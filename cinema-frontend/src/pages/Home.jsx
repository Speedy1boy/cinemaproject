import { useState, useEffect } from 'react';
import { Box, Container, Typography, CircularProgress, Alert } from '@mui/material';
import MovieCard from '../components/MovieCard';
import api from '../api/axiosConfig';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await api.get('/movies');
        setMovies(res.data);
      } catch (err) {
        setError('Не удалось загрузить фильмы. Попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  return (
    <Box sx={{ bgcolor: 'background.default', flexGrow: 1, transition: 'background-color 0.3s ease' }}>
      <Container maxWidth="lg">
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          py: '40px',
        }}>
          <Box>
            <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: 'text.primary', transition: 'color 0.3s ease' }}>
              Афиша кинотеатра
            </Typography>
            <Typography sx={{ mt: '8px', color: 'text.secondary', transition: 'color 0.3s ease' }}>
              Выберите фильм и забронируйте лучшие места
            </Typography>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', pb: '60px' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
        ) : movies.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ pb: '60px', transition: 'color 0.3s ease' }}>
            В афише пока нет фильмов
          </Typography>
        ) : (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px',
            pb: '60px',
          }}>
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}