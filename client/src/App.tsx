// client/src/App.tsx
import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext'; // Импорт корзины
import { Navbar } from './components/Navbar';
import { ProductModal } from './components/ProductModal';
import { CartModal } from './components/CartModal.tsx'; // Импорт шторки корзины
import api from './api';
import type { Product } from './types';
import './App.css';

function App() {
    const { user, login, register } = useAuth();
    const { addToCart } = useCart(); // Хук для добавления

    // --- Состояния данных ---
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    // --- Состояния UI (Модалки) ---
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Загрузка товаров при старте
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await api.get<Product[]>('/products');
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    // --- Обработчики ---

    // 1. Клик по кнопке в модалке товара ("Add to Cart" / "Sign In")
    const handleModalActionClick = (product: Product) => {
        if (!user) {
            // Если гость - закрываем товар, открываем вход
            setSelectedProduct(null);
            setShowAuthModal(true);
        } else {
            // Если свой - добавляем в корзину
            addToCart(product);
            setSelectedProduct(null); // Закрываем модалку товара
            // Корзина откроется автоматически (логика внутри addToCart в CartContext)
        }
    };

    // 2. Вход / Регистрация
    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isLoginMode) {
                await login(email, password);
            } else {
                await register(email, password);
            }
            setShowAuthModal(false);
            setEmail('');
            setPassword('');
        } catch (err) {
            // Ошибки логирует AuthContext
        }
    };

    return (
        <div className="app-container">
            <Navbar onOpenAuth={() => setShowAuthModal(true)} />

            {/* Глобальная корзина (Шторка) */}
            <CartModal />

            {/* --- Hero Section --- */}
            <header className="hero">
                <h1>The Spirit of Tea</h1>
                <p>Discover rare, aged Pu-erh and single-origin teas sourced directly from the ancient mountains of Yunnan.</p>
            </header>

            {/* --- Main Content --- */}
            <main className="main-content">
                <div className="section-title">- Curated Collection -</div>

                {loading ? (
                    <div style={{ textAlign: 'center', color: '#a69080', marginTop: '3rem' }}>
                        Steeping the catalogue... 🍵
                    </div>
                ) : (
                    <div className="product-grid">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="product-card"
                                onClick={() => setSelectedProduct(product)} // Открываем детали
                                style={{ cursor: 'pointer' }}
                            >
                                <img
                                    src={product.imageUrl || 'https://via.placeholder.com/400x300'}
                                    alt={product.title}
                                    className="card-image"
                                />
                                <div className="card-body">
                                    <span className="card-category">{product.category?.name}</span>
                                    <h3 className="card-title">{product.title}</h3>
                                    <p className="card-desc">{product.description}</p>

                                    <div className="card-footer">
                                        <span className="card-price">${Number(product.price).toFixed(2)}</span>
                                        <button className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.7rem' }}>
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* --- Модалка товара (Детали) --- */}
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    isUserLoggedIn={!!user}
                    onActionButtonClick={handleModalActionClick}
                />
            )}

            {/* --- Модалка авторизации --- */}
            {showAuthModal && (
                <div className="auth-overlay" onClick={(e) => {
                    if (e.target === e.currentTarget) setShowAuthModal(false);
                }}>
                    <div className="auth-modal">
                        <h2 style={{ color: '#d4a373', marginBottom: '1.5rem', textAlign: 'center', fontFamily: 'var(--font-serif)' }}>
                            {isLoginMode ? 'Welcome Back' : 'Join the Journey'}
                        </h2>
                        <form onSubmit={handleAuthSubmit}>
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email} onChange={e => setEmail(e.target.value)} required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password} onChange={e => setPassword(e.target.value)} required
                            />
                            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}>
                                {isLoginMode ? 'Sign In' : 'Create Account'}
                            </button>
                        </form>
                        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#a69080' }}>
                            {isLoginMode ? 'New to Yunnan Soul?' : 'Already have an account?'}
                            <span
                                onClick={() => setIsLoginMode(!isLoginMode)}
                                style={{ color: '#d4a373', cursor: 'pointer', marginLeft: '8px', textDecoration: 'underline', fontWeight: 'bold' }}
                            >
                                {isLoginMode ? 'Register now' : 'Sign in here'}
                            </span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
