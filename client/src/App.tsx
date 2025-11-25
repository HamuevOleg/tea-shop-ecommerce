// client/src/App.tsx - Fixed version with proper imports and components
import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProductModal } from './components/ProductModal';
import { CartModal } from './components/CartModal';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { api } from './api';
import type { Product } from './types';
import './App.css';

function App() {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);

    const { user, login, register } = useAuth();
    const { addToCart } = useCart();

    // Загрузка товаров
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get<Product[]>('/products');
                setProducts(data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Обработка авторизации
    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password);
                setIsLogin(true);
            }
            setShowAuthModal(false);
            setEmail('');
            setPassword('');
        } catch (error) {
            console.error('Auth error:', error);
        }
    };

    // Обработка клика по кнопке в модалке товара
    const handleProductAction = (product: Product) => {
        if (user) {
            addToCart(product);
            setSelectedProduct(null);
        } else {
            setSelectedProduct(null);
            setShowAuthModal(true);
        }
    };

    return (
        <div className="app-container">
            <Navbar onOpenAuth={() => setShowAuthModal(true)} />

            {/* Hero Section */}
            <section className="hero">
                <h1>YunnanSoul Tea Collection</h1>
                <p>Discover premium artisan teas sourced directly from ancient tea gardens</p>
            </section>

            {/* Main Content */}
            <main className="main-content">
                <h2 className="section-title">Curated Selection</h2>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍵</div>
                        <p>Loading our finest teas...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
                        <p>No products available at the moment.</p>
                    </div>
                ) : (
                    <div className="product-grid">
                        {products.map((product) => (
                            <article key={product.id} className="product-card">
                                <img
                                    src={product.imageUrl || 'https://via.placeholder.com/400x300?text=Tea'}
                                    alt={product.title}
                                    className="card-image"
                                    loading="lazy"
                                />
                                <div className="card-body">
                                    <span className="card-category">{product.category.name}</span>
                                    <h3 className="card-title">{product.title}</h3>
                                    <p className="card-desc">
                                        {product.description || 'A premium tea selection from our collection.'}
                                    </p>
                                    <div className="card-footer">
                                        <span className="card-price">${Number(product.price).toFixed(2)}</span>
                                        <button
                                            className="btn-primary"
                                            onClick={() => setSelectedProduct(product)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>

            {/* Product Modal */}
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onActionButtonClick={handleProductAction}
                    isUserLoggedIn={!!user}
                />
            )}

            {/* Cart Modal */}
            <CartModal />

            {/* Auth Modal */}
            {showAuthModal && (
                <div className="auth-overlay" onClick={() => setShowAuthModal(false)}>
                    <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setShowAuthModal(false)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--color-text-muted)',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                padding: '0.5rem'
                            }}
                        >
                            ×
                        </button>

                        <h2 style={{
                            fontFamily: 'var(--font-serif)',
                            color: 'var(--color-accent)',
                            marginBottom: '2rem',
                            fontSize: '1.8rem'
                        }}>
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h2>

                        <form onSubmit={handleAuth}>
                            <input
                                type="email"
                                placeholder="Email"
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
                                minLength={6}
                            />
                            <button
                                type="submit"
                                className="btn-primary"
                                style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }}
                            >
                                {isLogin ? 'Sign In' : 'Register'}
                            </button>
                        </form>

                        <p style={{
                            textAlign: 'center',
                            marginTop: '1.5rem',
                            color: 'var(--color-text-muted)',
                            fontSize: '0.9rem'
                        }}>
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--color-accent)',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    fontSize: '0.9rem'
                                }}
                            >
                                {isLogin ? 'Sign Up' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;