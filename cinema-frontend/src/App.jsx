import { useState, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './theme';

import Header from './components/Header';
import Home from './pages/Home';

function App() {
    // Состояние для темы (по умолчанию берем светлую)
    const [mode, setMode] = useState('light');

    // Функция переключения темы
    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    // Мемоизируем тему, чтобы она не пересоздавалась при каждом рендере
    const theme = useMemo(() => getTheme(mode), [mode]);

    return (
        <ThemeProvider theme={theme}>
            {/* CssBaseline сбрасывает дефолтные отступы браузера и применяет цвета фона темы */}
            <CssBaseline /> 
            
            <Header mode={mode} toggleTheme={toggleTheme} />
            
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<div>Страница авторизации (TODO)</div>} />
                <Route path="/movie/:id" element={<div>Страница фильма (TODO)</div>} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;