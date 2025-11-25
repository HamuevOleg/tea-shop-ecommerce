// client/src/components/Navbar.tsx
import { useState } from 'react';
import './Navbar.css';
import { useAuth } from '../context/AuthContext';
import AdminPanel from './AdminPanel';
import ProfileModal from './ProfileModal'; // <--- Добавляем импорт профиля

interface NavbarProps {
    onCartClick: () => void;
    onOpenAuth: () => void;
}

export const Navbar = ({ onCartClick, onOpenAuth }: NavbarProps) => {
    const { user, logout } = useAuth();

    // Состояния для модальных окон
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false); // <--- Состояние для профиля

    return (
        <>
            <nav className="navbar">
                <div className="navbar-logo">YunnanSoul</div>
                <div className="navbar-links">

                    {/* Кнопка Админки (Только для роли ADMIN) */}
                    {user?.role === 'ADMIN' && (
                        <button
                            className="nav-btn admin-btn"
                            onClick={() => setIsAdminOpen(true)}
                            style={{ color: '#ff7875', borderColor: '#ff7875', marginRight: '10px' }}
                        >
                            Admin Panel
                        </button>
                    )}

                    <button className="nav-btn" onClick={onCartClick}>
                        Cart
                    </button>

                    {user ? (
                        <div className="user-menu">
                            {/* Сделали email кнопкой для открытия профиля */}
                            <button
                                className="nav-btn username-btn"
                                onClick={() => setIsProfileOpen(true)}
                                style={{ fontWeight: 'bold', textDecoration: 'underline', border: 'none' }}
                            >
                                {user.email}
                            </button>

                            <button className="nav-btn logout" onClick={logout}>Exit</button>
                        </div>
                    ) : (
                        <button className="nav-btn" onClick={onOpenAuth}>
                            Login
                        </button>
                    )}
                </div>
            </nav>

            {/* --- Модальные окна --- */}

            {/* Админка */}
            <AdminPanel
                isOpen={isAdminOpen}
                onClose={() => setIsAdminOpen(false)}
            />

            {/* Профиль пользователя */}
            <ProfileModal
                user={user}
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                onLogout={logout}
            />
        </>
    );
};

export default Navbar;