// client/src/components/ProfileModal.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './ProfileModal.css';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { user, updateUser } = useAuth();

    // Основные поля
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [deliveryMethod, setDeliveryMethod] = useState<'COURIER' | 'POST'>('COURIER');

    // Поля адреса (разбиты)
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [postalCode, setPostalCode] = useState('');

    const [loading, setLoading] = useState(false);

    // Заполняем данные при открытии модалки
    useEffect(() => {
        if (isOpen && user) {
            setName(user.name || '');
            setPhone(user.phone || '');
            setDeliveryMethod((user.deliveryMethod as 'COURIER' | 'POST') || 'COURIER');

            // Логика разбора адреса: "Город, Улица, Дом"
            if (user.address) {
                const parts = user.address.split(',').map(s => s.trim());
                if (parts.length >= 3) {
                    setCity(parts[0]);
                    setStreet(parts[1]);
                    setHouseNumber(parts.slice(2).join(', '));
                } else if (parts.length === 1 && /^\d+$/.test(parts[0])) {
                    // Если это просто число, значит это почтовый индекс
                    setPostalCode(parts[0]);
                } else {
                    setStreet(user.address);
                }
            }
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Склеиваем адрес в зависимости от метода доставки
            const fullAddress = deliveryMethod === 'POST'
                ? postalCode
                : `${city}, ${street}, ${houseNumber}`;

            await updateUser({
                name,
                phone,
                deliveryMethod,
                address: fullAddress
            });
            onSuccess();
        } catch (error) {
            console.error(error);
            alert('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-modal-overlay" onClick={onClose}>
            <div className="profile-modal-content" onClick={e => e.stopPropagation()}>
                <div className="profile-modal-header">
                    <h2>Complete Your Profile</h2>
                    <button className="profile-close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="profile-form">
                    {/* Personal Info Section */}
                    <div className="form-section">
                        <h3 className="section-label">Personal Information</h3>

                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="e.g. John Doe"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                placeholder="+1 234 567 890"
                                required
                            />
                        </div>
                    </div>

                    {/* Delivery Method Selection - moved before address */}
                    <div className="form-section">
                        <h3 className="section-label">Delivery Method</h3>
                        <div className="delivery-options">
                            <label className={`delivery-option ${deliveryMethod === 'COURIER' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="delivery"
                                    value="COURIER"
                                    checked={deliveryMethod === 'COURIER'}
                                    onChange={() => setDeliveryMethod('COURIER')}
                                />
                                <span className="option-title">Courier Delivery</span>
                                <span className="option-desc">Directly to your door</span>
                            </label>

                            <label className={`delivery-option ${deliveryMethod === 'POST' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="delivery"
                                    value="POST"
                                    checked={deliveryMethod === 'POST'}
                                    onChange={() => setDeliveryMethod('POST')}
                                />
                                <span className="option-title">Post Office</span>
                                <span className="option-desc">Pickup at nearest point</span>
                            </label>
                        </div>
                    </div>

                    {/* Delivery Section - conditional rendering */}
                    <div className="form-section">
                        <h3 className="section-label">Delivery Address</h3>

                        {deliveryMethod === 'COURIER' ? (
                            <>
                                <div className="form-row">
                                    <div className="form-group city-group">
                                        <label>City</label>
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={e => setCity(e.target.value)}
                                            placeholder="Chisinau"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group street-group">
                                        <label>Street / Address</label>
                                        <input
                                            type="text"
                                            value={street}
                                            onChange={e => setStreet(e.target.value)}
                                            placeholder="Broadway Ave"
                                            required
                                        />
                                    </div>
                                    <div className="form-group house-group">
                                        <label>House / Apt</label>
                                        <input
                                            type="text"
                                            value={houseNumber}
                                            onChange={e => setHouseNumber(e.target.value)}
                                            placeholder="42B"
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="form-group">
                                <label>Postal Code</label>
                                <input
                                    type="text"
                                    value={postalCode}
                                    onChange={e => setPostalCode(e.target.value)}
                                    placeholder="e.g. MD-2001"
                                    required
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-save" disabled={loading}>
                            {loading ? 'Saving...' : 'Save & Continue to Payment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};