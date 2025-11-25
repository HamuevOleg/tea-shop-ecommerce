// client/src/components/Navbar.tsx
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <span>🍵</span> Tea Shop
            </div>

            {user && (
                <div className="nav-user">
          <span className="user-info">
            {user.email} <span style={{ opacity: 0.5 }}>({user.role})</span>
          </span>
                    <button className="btn btn-outline" onClick={logout} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                        Выйти
                    </button>
                </div>
            )}
        </nav>
    );
};