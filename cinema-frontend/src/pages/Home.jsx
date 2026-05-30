import { useState, useEffect } from 'react';
import { Box, Container, Typography, CircularProgress, Alert, TextField, InputAdornment } from '@mui/material';
import { Search } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import api from '../api/axiosConfig';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredMovies = movies.filter(movie => 
    movie.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.genre?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ bgcolor: 'background.default', flexGrow: 1, transition: 'background-color 0.3s ease' }}>
      <Container maxWidth="lg">
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          py: '40px',
          gap: 3,
          flexWrap: 'wrap',
        }}>
          <Box>
            <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: 'text.primary', transition: 'color 0.3s ease' }}>
              Афиша кинотеатра
            </Typography>
            <Typography sx={{ mt: '8px', color: 'text.secondary', transition: 'color 0.3s ease' }}>
              Выберите фильм и забронируйте лучшие места
            </Typography>
          </Box>
          
          <TextField
            size="small"
            placeholder="Поиск фильма..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} />
                  </InputAdornment>
                ),
              }
            }}
            sx={{ 
              width: { xs: '100%', sm: 300 },
              bgcolor: 'background.paper', 
              borderRadius: '8px', 
              transition: 'background-color 0.3s ease',
              '& .MuiOutlinedInput-root': { 
                borderRadius: '8px', 
                transition: 'background-color 0.3s ease, border-color 0.3s ease' 
              },
              '& .MuiOutlinedInput-input': { 
                bgcolor: 'transparent !important' 
              },
            }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', pb: '60px' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
        ) : filteredMovies.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ pb: '60px', transition: 'color 0.3s ease' }}>
            {searchQuery ? 'Ничего не найдено' : 'В афише пока нет фильмов'}
          </Typography>
        ) : (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px',
            pb: '60px',
          }}>
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}