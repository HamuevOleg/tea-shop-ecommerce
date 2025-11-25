// client/src/App.tsx
import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProductModal } from './components/ProductModal';
import { CartModal } from './components/CartModal';
import TeaStory from './components/TeaStory';
import TeaCeremony from './components/TeaCeremony'; // <-- Новый импорт
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { api } from './api';
import type { Product, Category } from './types';
import './App.css';

function App() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'story' | 'ceremony' | 'store'>('story'); // <-- Добавили 'ceremony'
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { user, login, register } = useAuth();
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    api.get<Product[]>('/products'),
                    api.get<Category[]>('/categories')
                ]);

                setProducts(productsRes.data);
                setCategories(categoriesRes.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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

    const handleProductAction = (product: Product) => {
        if (user) {
            addToCart(product);
            setSelectedProduct(null);
        } else {
            setSelectedProduct(null);
            setShowAuthModal(true);
        }
    };

    const filteredProducts = selectedCategoryId
        ? products.filter(p => p.categoryId === selectedCategoryId)
        : products;

    return (
        <div className="app-container">
            <Navbar onOpenAuth={() => setShowAuthModal(true)} />

            {/* Переключатель вкладок - теперь 3 кнопки */}
            <div className="view-switcher-container" style={{ marginTop: '80px' }}>
                <div className="view-switcher">
                    <button
                        className={`view-btn ${activeTab === 'story' ? 'active' : ''}`}
                        onClick={() => setActiveTab('story')}
                    >
                        Tea Story
                    </button>
                    <button
                        className={`view-btn ${activeTab === 'ceremony' ? 'active' : ''}`}
                        onClick={() => setActiveTab('ceremony')}
                    >
                        Ceremony
                    </button>
                    <button
                        className={`view-btn ${activeTab === 'store' ? 'active' : ''}`}
                        onClick={() => setActiveTab('store')}
                    >
                        Store
                    </button>
                </div>
            </div>

            <main className="main-content">
                {activeTab === 'story' ? (
                    <TeaStory />
                ) : activeTab === 'ceremony' ? (
                    <TeaCeremony /> // <-- Новый компонент
                ) : (
                    <div className="store-section fade-in">
                        <section className="hero" style={{ marginBottom: '30px' }}>
                            <h1>YunnanSoul Tea Collection</h1>
                            <p>Discover premium artisan teas sourced directly from ancient tea gardens</p>
                        </section>

                        <div className="filters-container">
                            <button
                                className={`filter-btn ${selectedCategoryId === null ? "active" : ""}`}
                                onClick={() => setSelectedCategoryId(null)}
                            >
                                All
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    className={`filter-btn ${selectedCategoryId === cat.id ? "active" : ""}`}
                                    onClick={() => setSelectedCategoryId(cat.id)}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍵</div>
                                <p>Loading our finest teas...</p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
                                <p>No products found in this category.</p>
                            </div>
                        ) : (
                            <div className="product-grid">
                                {filteredProducts.map((product) => (
                                    <article key={product.id} className="product-card" onClick={() => setSelectedProduct(product)}>
                                        <div className="card-image-wrapper">
                                            <img
                                                src={product.imageUrl || 'https://via.placeholder.com/400x300?text=Tea'}
                                                alt={product.title}
                                                className="card-image"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="card-body">
                                            <span className="card-category">
                                                {product.category?.name || categories.find(c => c.id === product.categoryId)?.name || 'Tea'}
                                            </span>
                                            <h3 className="card-title">{product.title}</h3>
                                            <div className="card-footer">
                                                <span className="card-price">${Number(product.price).toFixed(2)}</span>
                                                <button
                                                    className="btn-primary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedProduct(product);
                                                    }}
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onActionButtonClick={handleProductAction}
                    isUserLoggedIn={!!user}
                />
            )}

            <CartModal />

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