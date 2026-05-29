import { createTheme } from '@mui/material';

// Мы можем создать функцию, которая возвращает тему в зависимости от режима (light/dark)
export const getTheme = (mode) => createTheme({
    palette: {
        mode,
        primary: {
            main: '#4f46e5', // Наш цвет акцента (индиго)
        },
        background: {
            default: mode === 'light' ? '#f8fafc' : '#0f172a',
            paper: mode === 'light' ? '#ffffff' : '#1e293b',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        button: {
            textTransform: 'none', // Отключаем капс на кнопках (делает дизайн строже)
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12, // Скругления как в макете
    },
});