import axios from 'axios';

// Базовый URL вашего бэкенда (по умолчанию Spring Boot работает на 8080)
const api = axios.create({
    baseURL: 'http://localhost:8081/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;