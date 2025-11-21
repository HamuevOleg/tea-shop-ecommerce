import { useState } from 'react';
import './App.css';
import { products } from './data';
import type {Product} from './types';

function App() {
    const [cartCount, setCartCount] = useState(0);

    const handleAddToCart = (product: Product) => {
        setCartCount(prev => prev + 1);
        console.log(`Added ${product.name} to cart`);
    };

    return (
        <div className="app">
            <div className="container">
                {/* Header */}
                <header className="header">
                    <div className="logo">Zen Pu-erh</div>
                    <nav>
                        <button className="cart-btn">
                            Cart ({cartCount})
                        </button>
                    </nav>
                </header>

                {/* Hero Section */}
                <section className="hero">
                    <h1>The Spirit of Ancient Trees</h1>
                    <p>Discover the depth of time in every cup. Authentic aged Pu-erh tea from Yunnan.</p>
                    <button className="cta-button" onClick={() => window.scrollTo({top: 800, behavior: 'smooth'})}>
                        Shop Collection
                    </button>
                </section>

                {/* Products Section */}
                <main>
                    <h2 className="section-title">Curated Selection</h2>
                    <div className="products-grid">
                        {products.map((product) => (
                            <div key={product.id} className="product-card">
                                <img src={product.imageUrl} alt={product.name} className="card-image" />
                                <div className="card-content">
                                    <span className="card-category">{product.category}</span>
                                    <h3 className="card-title">{product.name}</h3>
                                    <span className="card-year">{product.year} Harvest</span>
                                    <p className="card-desc">{product.description}</p>

                                    <div className="card-footer">
                                        <span className="price">${product.price.toFixed(2)}</span>
                                        <button
                                            className="add-btn"
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>

                {/* Simple Footer */}
                <footer style={{ textAlign: 'center', padding: '4rem 0', color: '#666' }}>
                    <p>&copy; 2025 Zen Pu-erh Shop. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}

export default App;