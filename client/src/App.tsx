// client/src/App.tsx
import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import api from './api'; // Импорт нашего настроенного axios
import type { Product } from './types'; // Импорт типов
import './App.css';

function App() {
    const { user, login, register } = useAuth();

    // Состояния для Auth
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [authLoading, setAuthLoading] = useState(false);

    // Состояния для Товаров
    const [products, setProducts] = useState<Product[]>([]);
    const [productsLoading, setProductsLoading] = useState(false);

    // Загружаем товары, если пользователь вошел
    useEffect(() => {
        if (user) {
            fetchProducts();
        }
    }, [user]);

    const fetchProducts = async () => {
        setProductsLoading(true);
        try {
            // Запрос к нашему бэкенду
            const { data } = await api.get<Product[]>('/products');
            setProducts(data);
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
            alert('Не удалось загрузить товары');
        } finally {
            setProductsLoading(false);
        }
    };

    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoading(true);
        try {
            if (isLoginMode) {
                await login(email, password);
            } else {
                await register(email, password);
            }
        } catch (err) {
            // Ошибка уже обработана в context
        } finally {
            setAuthLoading(false);
        }
    };

    return (
        <div className="app-container">
            <Navbar />

            <main className="main-content">
                {!user ? (
                    // --- ЭКРАН ВХОДА ---
                    <div className="auth-card">
                        <h2>{isLoginMode ? 'Вход в аккаунт' : 'Регистрация'}</h2>
                        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                            {isLoginMode
                                ? 'Рады видеть вас снова! Выпейте чаю.'
                                : 'Создайте аккаунт, чтобы заказывать лучший чай.'}
                        </p>

                        <form onSubmit={handleAuthSubmit} className="form-group">
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={authLoading}
                            >
                                {authLoading ? 'Загрузка...' : (isLoginMode ? 'Войти' : 'Создать аккаунт')}
                            </button>
                        </form>

                        <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                            {isLoginMode ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
                            <button
                                onClick={() => setIsLoginMode(!isLoginMode)}
                                className="btn-link"
                            >
                                {isLoginMode ? 'Зарегистрироваться' : 'Войти'}
                            </button>
                        </div>
                    </div>
                ) : (
                    // --- ВИТРИНА МАГАЗИНА ---
                    <div>
                        <div style={{ marginBottom: '2rem' }}>
                            <h1>Наш ассортимент 🌿</h1>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Лучшие сорта чая, отобранные специально для вас.
                            </p>
                        </div>

                        {productsLoading ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>Загрузка чая... 🍵</div>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                gap: '2rem'
                            }}>
                                {products.map((product) => (
                                    <div key={product.id} style={{
                                        background: 'white',
                                        borderRadius: 'var(--radius)',
                                        boxShadow: 'var(--shadow)',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        {/* Изображение товара */}
                                        <div style={{ height: '200px', background: '#e5e7eb', overflow: 'hidden' }}>
                                            {product.imageUrl ? (
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.title}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🍵</div>
                                            )}
                                        </div>

                                        {/* Информация о товаре */}
                                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{product.title}</h3>
                                                <span style={{
                                                    background: '#ecfdf5',
                                                    color: '#059669',
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '99px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold'
                                                }}>
                          {product.category?.name}
                        </span>
                                            </div>

                                            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
                                                {product.description}
                                            </p>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                          ${Number(product.price).toFixed(2)}
                        </span>
                                                <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                                                    В корзину
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {products.length === 0 && !productsLoading && (
                            <p style={{ textAlign: 'center' }}>Товары не найдены.</p>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;