import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ProfileModal } from './ProfileModal';

interface NavbarProps {
    onOpenAuth: () => void;
}

export const Navbar = ({ onOpenAuth }: NavbarProps) => {
    const { user, logout } = useAuth();
    const { totalItems, openCart } = useCart();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <>
            <nav style={{
                background: 'var(--color-bg)',
                borderBottom: '1px solid var(--color-card)',
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: 'bold', fontFamily: 'var(--font-serif)', color: 'var(--color-text-main)', lineHeight: 1 }}>
                        <span style={{ color: 'var(--color-accent)' }}>Yunnan</span>Soul
                    </span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', letterSpacing: '1px' }}>
                        雲南之魂
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <button
                        onClick={openCart}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-text-main)',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            position: 'relative',
                            padding: '5px'
                        }}
                        title="Open Cart"
                    >
                        🛒
                        {totalItems > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: -5,
                                right: -8,
                                background: '#ef4444',
                                color: 'white',
                                fontSize: '0.75rem',
                                padding: '2px 6px',
                                borderRadius: '50%',
                                fontWeight: 'bold',
                                border: '2px solid var(--color-bg)'
                            }}>
                                {totalItems}
                            </span>
                        )}
                    </button>

                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <button
                                onClick={() => setIsProfileOpen(true)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--color-text-muted)',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    padding: '0.5rem'
                                }}
                            >
                                {user.email}
                            </button>
                            <button
                                onClick={logout}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid var(--color-accent)',
                                    color: 'var(--color-accent)',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontFamily: 'var(--font-sans)',
                                    fontSize: '0.9rem'
                                }}
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={onOpenAuth}
                            className="btn-primary"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </nav>

            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                onSuccess={() => setIsProfileOpen(false)}
            />
        </>
    );
};