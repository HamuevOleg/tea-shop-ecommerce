// client/src/api.ts
import axios from 'axios';

// Базовый URL вашего бэкенда
const API_URL = 'http://localhost:3000';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Автоматически добавляем токен в заголовки, если он есть
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;