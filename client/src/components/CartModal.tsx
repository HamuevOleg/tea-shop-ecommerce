// client/src/components/CartModal.tsx
import React from 'react';
import { useCart } from '../context/CartContext';
import './CartModal.css';

export const CartModal: React.FC = () => {
    const { isCartOpen, closeCart, items, removeFromCart, totalPrice } = useCart();

    if (!isCartOpen) return null;

    // Закрытие по клику на фон
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeCart();
        }
    };

    return (
        <div className="cart-modal-overlay" onClick={handleOverlayClick}>
            <div className="cart-modal-content">

                {/* Header */}
                <div className="cart-modal-header">
                    <h2 className="cart-modal-title">Your Collection</h2>
                    <button className="cart-close-btn" onClick={closeCart}>×</button>
                </div>

                {/* Body (Список товаров) */}
                <div className="cart-modal-body">
                    {items.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem 0', color: '#a69080' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🍵</div>
                            <p>Your tea tray is empty.</p>
                            <button
                                onClick={closeCart}
                                style={{
                                    marginTop: '1rem', background: 'transparent', border: '1px solid var(--color-accent)',
                                    color: 'var(--color-accent)', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer'
                                }}
                            >
                                Browse Teas
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="cart-item-row">
                                <img
                                    src={item.imageUrl || ''}
                                    alt={item.title}
                                    className="cart-item-thumb"
                                />
                                <div className="cart-item-info">
                                    <div className="cart-item-name">{item.title}</div>
                                    <div className="cart-item-price-calc">
                                        {item.quantity} x ${Number(item.price).toFixed(2)}
                                    </div>
                                </div>
                                <button
                                    className="cart-item-remove"
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer (Итого + Кнопка) */}
                {items.length > 0 && (
                    <div className="cart-modal-footer">
                        <div className="cart-total-row">
                            <span>Total Estimate</span>
                            <span className="cart-total-price">${totalPrice.toFixed(2)}</span>
                        </div>
                        <button
                            className="btn-checkout-full"
                            onClick={() => alert('Proceeding to secure checkout...')}
                        >
                            Secure Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};