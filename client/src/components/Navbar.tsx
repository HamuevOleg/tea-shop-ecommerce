// client/src/components/Navbar.tsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import AdminPanel from './AdminPanel';
import { ProfileModal } from './ProfileModal';

interface NavbarProps {
    onOpenAuth: () => void;
}

export const Navbar = ({ onOpenAuth }: NavbarProps) => {
    const { user, logout } = useAuth();
    const { openCart } = useCart();

    // States for modals
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <>
            <nav className="navbar">
                <div className="navbar-logo">YunnanSoul</div>
                <div className="navbar-links">

                    {/* Admin Panel Button (Only for ADMIN role) */}
                    {user?.role === 'ADMIN' && (
                        <button
                            className="nav-btn admin-btn"
                            onClick={() => setIsAdminOpen(true)}
                            style={{ color: '#ff7875', borderColor: '#ff7875', marginRight: '10px' }}
                        >
                            Admin Panel
                        </button>
                    )}

                    <button className="nav-btn" onClick={openCart}>
                        Cart
                    </button>

                    {user ? (
                        <div className="user-menu">
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

            {/* Modals */}
            <AdminPanel
                isOpen={isAdminOpen}
                onClose={() => setIsAdminOpen(false)}
            />

            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                onSuccess={() => setIsProfileOpen(false)}
            />
        </>
    );
};

export default Navbar;