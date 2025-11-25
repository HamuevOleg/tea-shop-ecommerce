// client/src/components/Navbar.tsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ProfileModal } from './ProfileModal';
import AdminPanel from './AdminPanel'; // <--- Импортируем админку
import './Navbar.css';

interface NavbarProps {
    onOpenAuth: () => void;
}

export const Navbar = ({ onOpenAuth }: NavbarProps) => {
    const { user, logout } = useAuth();
    const { totalItems, openCart } = useCart();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Состояние для открытия админки
    const [isAdminOpen, setIsAdminOpen] = useState(false);

    return (
        <>
            <nav className="navbar">
                <div className="navbar-brand">
                    <span className="brand-title">
                        <span className="accent">Yunnan</span>Soul
                    </span>
                    <span className="brand-subtitle">
                        雲南之魂
                    </span>
                </div>

                <div className="navbar-actions">
                    <button
                        onClick={openCart}
                        className="cart-btn"
                        title="Open Cart"
                    >
                        🛒
                        {totalItems > 0 && (
                            <span className="cart-badge">
                                {totalItems}
                            </span>
                        )}
                    </button>

                    {user ? (
                        <div className="user-actions">
                            {/* КНОПКА АДМИНКИ: Показываем только если роль ADMIN */}
                            {user.role === 'ADMIN' && (
                                <button
                                    onClick={() => setIsAdminOpen(true)}
                                    className="admin-launch-btn"
                                >
                                    Admin Panel
                                </button>
                            )}

                            <button
                                onClick={() => setIsProfileOpen(true)}
                                className="profile-link"
                            >
                                {user.email}
                            </button>
                            <button
                                onClick={logout}
                                className="logout-btn"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={onOpenAuth}
                            className="btn-primary" // Убедись, что этот класс есть в App.css или добавь стиль ниже
                            style={{
                                padding: '8px 16px',
                                background: 'var(--color-accent)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </nav>

            {/* Модальные окна */}
            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                onSuccess={() => setIsProfileOpen(false)}
            />

            {/* Рендерим админку */}
            <AdminPanel
                isOpen={isAdminOpen}
                onClose={() => setIsAdminOpen(false)}
            />
        </>
    );
};