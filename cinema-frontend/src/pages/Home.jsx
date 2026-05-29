import { Box, Container, Typography } from '@mui/material';
import MovieCard from '../components/MovieCard';

const MOVIES_DATA = [
  {
    id: 1,
    title: 'Дюна: Часть вторая',
    genre: 'Фантастика, Боевик, Драма',
    duration: 166,
    rating: 8.5,
    ageRating: '16+',
    poster: 'https://images.unsplash.com/photo-1534809027769-6217b0807022?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Человек-паук: Через вселенные',
    genre: 'Мультфильм, Фантастика',
    duration: 140,
    rating: 8.9,
    ageRating: '12+',
    poster: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Оппенгеймер',
    genre: 'Биография, Драма, История',
    duration: 180,
    rating: 8.2,
    ageRating: '18+',
    poster: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Хатико: Самый верный друг',
    genre: 'Драма, Семейный',
    duration: 93,
    rating: 8.3,
    ageRating: '6+',
    poster: 'https://images.unsplash.com/photo-1616530940355-351fabd9524b?q=80&w=600&auto=format&fit=crop',
  },
];

export default function Home() {
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
            <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: 'text.primary' }}>
              Афиша кинотеатра
            </Typography>
            <Typography sx={{ mt: '8px', color: 'text.secondary' }}>
              Выберите фильм и забронируйте лучшие места
            </Typography>
          </Box>
        </Box>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '24px',
          pb: '60px',
        }}>
          {MOVIES_DATA.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}