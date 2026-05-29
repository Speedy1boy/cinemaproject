import { Container, Typography, Box } from '@mui/material';

export default function Home() {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold">Афиша кинотеатра</Typography>
                <Typography variant="body1" color="text.secondary">
                    Выберите фильм и забронируйте лучшие места
                </Typography>
            </Box>
            {/* Здесь потом будет компонент <Grid> со списком фильмов */}
        </Container>
    );
}