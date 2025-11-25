// client/src/components/ProfileModal.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import type { Order } from '../types';
import './ProfileModal.css';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { user, updateUser } = useAuth();

    // Tabs: 'profile' or 'history'
    const [activeTab, setActiveTab] = useState<'profile' | 'history'>('profile');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        idnp: '',
        address: '',
        deliveryMethod: 'COURIER',
        avatarUrl: ''
    });

    useEffect(() => {
        if (isOpen && user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                idnp: user.idnp || '',
                address: user.address || '',
                deliveryMethod: user.deliveryMethod || 'COURIER',
                avatarUrl: user.avatarUrl || ''
            });
            setActiveTab('profile');
        }
    }, [isOpen, user]);

    useEffect(() => {
        if (isOpen && activeTab === 'history') {
            fetchHistory();
        }
    }, [isOpen, activeTab]);

    const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
            const { data } = await api.get<Order[]>('/orders/my');
            setOrders(data);
        } catch (error) {
            console.error("Failed to load history", error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateUser(formData);
            alert('Profile updated successfully!');
            if (onSuccess) onSuccess();
            else onClose();
        } catch (error) {
            console.error('Failed to update profile', error);
        }
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="profile-modal-overlay" onClick={handleOverlayClick}>
            <div className="profile-modal-content" onClick={e => e.stopPropagation()}>

                <div className="profile-modal-header">
                    <h2>My Profile</h2>
                    <button
                        className="profile-close-btn"
                        onClick={onClose}
                        type="button"
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>

                <div className="profile-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                        type="button"
                    >
                        My Details
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                        type="button"
                    >
                        Order History
                    </button>
                </div>

                <div className="profile-modal-body">
                    {activeTab === 'profile' ? (
                        <form onSubmit={handleSubmit} className="profile-form">
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    style={{opacity: 0.6}}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Full Name</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+373..."
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Delivery Address</label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="City, Street, Building..."
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Delivery Method</label>
                                    <div className="delivery-method-group">
                                        <label className={`delivery-radio-option ${formData.deliveryMethod === 'COURIER' ? 'active' : ''}`}>
                                            <input
                                                type="radio"
                                                name="deliveryMethod"
                                                value="COURIER"
                                                checked={formData.deliveryMethod === 'COURIER'}
                                                onChange={handleChange}
                                            />
                                            <span className="delivery-radio-title">Courier</span>
                                            <span className="delivery-radio-desc">To your door</span>
                                        </label>

                                        <label className={`delivery-radio-option ${formData.deliveryMethod === 'POST' ? 'active' : ''}`}>
                                            <input
                                                type="radio"
                                                name="deliveryMethod"
                                                value="POST"
                                                checked={formData.deliveryMethod === 'POST'}
                                                onChange={handleChange}
                                            />
                                            <span className="delivery-radio-title">Post Office</span>
                                            <span className="delivery-radio-desc">Pickup point</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="idnp">ID Code (Optional)</label>
                                    <input
                                        id="idnp"
                                        name="idnp"
                                        type="text"
                                        value={formData.idnp}
                                        onChange={handleChange}
                                        placeholder="For post office..."
                                    />
                                </div>
                            </div>

                            <div className="profile-modal-actions">
                                <button type="submit" className="btn-save">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="history-list">
                            {loadingHistory && (
                                <p style={{
                                    color: '#888',
                                    textAlign: 'center',
                                    padding: '2rem',
                                    fontSize: '1rem'
                                }}>
                                    Loading history...
                                </p>
                            )}

                            {!loadingHistory && orders.length === 0 && (
                                <p style={{
                                    color: '#a69080',
                                    textAlign: 'center',
                                    padding: '3rem',
                                    fontSize: '1.1rem'
                                }}>
                                    No orders yet 🍵
                                </p>
                            )}

                            {orders.map((order, index) => (
                                <div
                                    key={order.id}
                                    className="history-card"
                                    style={{
                                        animationDelay: `${index * 0.1}s`
                                    }}
                                >
                                    <div className="history-header">
                                        <span className="history-date">
                                            {formatDate(order.createdAt)}
                                        </span>
                                        <span className={`history-status status-${order.status}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="history-items">
                                        {order.items?.map(item => (
                                            <div key={item.id} className="history-item-row">
                                                <span>{item.product?.title || 'Unknown Product'}</span>
                                                <span style={{ color: '#888' }}>
                                                    {item.quantity} × ${Number(item.price).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="history-total">
                                        <span>Total:</span>
                                        <span>${Number(order.totalPrice).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};