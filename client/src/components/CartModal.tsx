// client/src/components/CartModal.tsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ProfileModal } from './ProfileModal';
import './CartModal.css';

export const CartModal: React.FC = () => {
    const { isCartOpen, closeCart, items, removeFromCart, totalPrice } = useCart();
    const { user } = useAuth();

    // Состояние для открытия модала профиля
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    if (!isCartOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeCart();
        }
    };

    const handleCheckoutClick = () => {
        if (!user) {
            alert('Пожалуйста, войдите в систему для оформления заказа');
            return;
        }

        // Проверяем, заполнен ли профиль (имя и телефон обязательны)
        if (!user.name || !user.phone || !user.address) {
            // Открываем модал профиля поверх корзины
            setIsProfileModalOpen(true);
        } else {
            // Если все ок, идем дальше
            processCheckout();
        }
    };

    const processCheckout = () => {
        // Здесь будет логика создания заказа
        alert(`Заказ оформляется на имя: ${user?.name}\nДоставка: ${user?.deliveryMethod === 'COURIER' ? 'Курьер' : 'Почта'}\nАдрес: ${user?.address}`);
        // TODO: Отправка заказа на сервер
    };

    return (
        <>
            <div className="cart-modal-overlay" onClick={handleOverlayClick}>
                <div className="cart-modal-content">

                    {/* Header */}
                    <div className="cart-modal-header">
                        <h2 className="cart-modal-title">Your Collection</h2>
                        <button className="cart-close-btn" onClick={closeCart}>×</button>
                    </div>

                    {/* Body */}
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

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="cart-modal-footer">
                            <div className="cart-total-row">
                                <span>Total Estimate</span>
                                <span className="cart-total-price">${totalPrice.toFixed(2)}</span>
                            </div>
                            <button
                                className="btn-checkout-full"
                                onClick={handleCheckoutClick}
                            >
                                Secure Checkout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Вложенный модал для профиля */}
            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                onSuccess={() => {
                    setIsProfileModalOpen(false);
                    // После успешного сохранения профиля сразу пытаемся оформить заказ снова
                    processCheckout();
                }}
            />
        </>
    );
};