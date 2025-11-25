import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '../api';
import type { User, AuthResponse } from '../types';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    // При загрузке страницы проверяем, есть ли токен и данные юзера в localStorage
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const { data } = await api.post<AuthResponse>('/auth/login', { email, password });

            // Сохраняем токен и юзера
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);

            alert('Успешный вход!');
        } catch (error: any) {
            console.error(error);
            alert('Ошибка входа: ' + (error.response?.data?.message || 'Неизвестная ошибка'));
            throw error;
        }
    };

    const register = async (email: string, password: string) => {
        try {
            await api.post('/auth/register', { email, password });
            alert('Регистрация успешна! Теперь войдите.');
        } catch (error: any) {
            console.error(error);
            alert('Ошибка регистрации: ' + (error.response?.data?.message || 'Ошибка'));
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};