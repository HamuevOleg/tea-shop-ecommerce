// client/src/components/CartModal.tsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ProfileModal } from './ProfileModal';
import { SuccessModal } from './SuccessModal'; // <--- НОВОЕ: Импорт
import { api } from '../api';
import './CartModal.css';

export const CartModal: React.FC = () => {
    const { isCartOpen, closeCart, items, removeFromCart, totalPrice, clearCart } = useCart();
    const { user } = useAuth();

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // <--- НОВОЕ: Состояние для успешного окна
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    if (!isCartOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Закрываем корзину только если не открыто окно успеха
        if (e.target === e.currentTarget && !isSuccessOpen) {
            closeCart();
        }
    };

    const handleCheckoutClick = () => {
        if (!user) {
            alert('Please log in to checkout.');
            return;
        }

        if (!user.name || !user.phone || !user.address) {
            setIsProfileModalOpen(true);
        } else {
            processCheckout();
        }
    };

    const processCheckout = async () => {
        setIsProcessing(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            const orderPayload = items.map(item => ({
                productId: item.id,
                quantity: item.quantity
            }));

            await api.post('/orders', { items: orderPayload });

            // <--- НОВОЕ: Вместо alert показываем красивое окно
            clearCart();
            setIsSuccessOpen(true);

        } catch (error: any) {
            console.error('Checkout failed:', error);
            const msg = error.response?.data?.message || 'Failed to place order.';
            alert(msg);
        } finally {
            setIsProcessing(false);
        }
    };

    // <--- НОВОЕ: Функция полного закрытия всего
    const handleCloseAll = () => {
        setIsSuccessOpen(false);
        closeCart();
    };

    return (
        <>
            <div className="cart-modal-overlay" onClick={handleOverlayClick}>
                {/* Скрываем содержимое корзины, если открыто окно успеха,
                   чтобы они не накладывались друг на друга визуально
                */}
                {!isSuccessOpen && (
                    <div className="cart-modal-content">
                        <div className="cart-modal-header">
                            <h2 className="cart-modal-title">Your Collection</h2>
                            <button className="cart-close-btn" onClick={closeCart}>×</button>
                        </div>

                        <div className="cart-modal-body">
                            {items.length === 0 ? (
                                <div className="cart-empty-state">
                                    <div className="cart-empty-icon">🍵</div>
                                    <p>Your tea tray is empty.</p>
                                    <button onClick={closeCart} className="btn-browse">
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

                        {items.length > 0 && (
                            <div className="cart-modal-footer">
                                <div className="cart-total-row">
                                    <span>Total Estimate</span>
                                    <span className="cart-total-price">${totalPrice.toFixed(2)}</span>
                                </div>
                                <button
                                    className={`btn-checkout-full ${isProcessing ? 'loading' : ''}`}
                                    onClick={handleCheckoutClick}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <span className="spinner"></span> Processing...
                                        </>
                                    ) : (
                                        'Secure Checkout'
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                onSuccess={() => {
                    setIsProfileModalOpen(false);
                    processCheckout();
                }}
            />

            {/* <--- НОВОЕ: Рендерим модуль успеха */}
            <SuccessModal
                isOpen={isSuccessOpen}
                onClose={handleCloseAll}
                address={user?.address}
            />
        </>
    );
};