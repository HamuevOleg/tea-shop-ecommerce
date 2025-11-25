// client/src/components/ProfileModal.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DeliveryMethod } from '../types';
import './ProfileModal.css';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void; // Вызывается после успешного сохранения
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { user, updateUser } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        idnp: '',
        address: '',
        deliveryMethod: 'COURIER' as DeliveryMethod,
        avatarUrl: ''
    });

    // Заполняем форму данными юзера при открытии
    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                idnp: user.idnp || '',
                address: user.address || '',
                deliveryMethod: user.deliveryMethod || 'COURIER',
                avatarUrl: user.avatarUrl || ''
            });
        }
    }, [user, isOpen]);

    if (!isOpen || !user) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMethodChange = (method: DeliveryMethod) => {
        setFormData(prev => ({ ...prev, deliveryMethod: method }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Базовая валидация
        if (!formData.name || !formData.phone || !formData.address) {
            alert('Пожалуйста, заполните обязательные поля');
            return;
        }

        try {
            await updateUser(formData);
            alert('Профиль успешно сохранен!');
            onSuccess();
        } catch (error) {
            // Ошибка уже обработана в контексте
        }
    };

    return (
        <div className="profile-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="profile-modal-content">
                <button className="profile-close-btn" onClick={onClose}>×</button>

                <div className="profile-header">
                    <h2>Завершение настройки</h2>
                    <p className="profile-subtitle">Для оформления заказа нам нужны ваши контакты</p>
                </div>

                <form onSubmit={handleSubmit} className="profile-form">

                    {/* Аватарка */}
                    <div className="avatar-section">
                        <div className="avatar-circle">
                            {formData.avatarUrl ? (
                                <img src={formData.avatarUrl} alt="Avatar" />
                            ) : (
                                <span>{user.email[0].toUpperCase()}</span>
                            )}
                        </div>
                        <input
                            type="text"
                            name="avatarUrl"
                            placeholder="URL ссылки на аватар"
                            value={formData.avatarUrl}
                            onChange={handleChange}
                            className="avatar-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Имя и Фамилия <span style={{color:'red'}}>*</span></label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Например: Иван Чайный"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Телефон <span style={{color:'red'}}>*</span></label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+373..."
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>IDNP (опционально)</label>
                            <input
                                name="idnp"
                                value={formData.idnp}
                                onChange={handleChange}
                                placeholder="13 цифр"
                                maxLength={13}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Способ доставки</label>
                        <div className="radio-group">
                            <div
                                className={`radio-card ${formData.deliveryMethod === 'COURIER' ? 'active' : ''}`}
                                onClick={() => handleMethodChange('COURIER')}
                            >
                                <span>🚚 Курьер</span>
                            </div>
                            <div
                                className={`radio-card ${formData.deliveryMethod === 'POST' ? 'active' : ''}`}
                                onClick={() => handleMethodChange('POST')}
                            >
                                <span>📦 Почта</span>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>
                            {formData.deliveryMethod === 'COURIER'
                                ? 'Адрес доставки (Улица, дом, кв.)'
                                : 'Почтовое отделение / Адрес пункта выдачи'} <span style={{color:'red'}}>*</span>
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder={formData.deliveryMethod === 'COURIER' ? "Кишинев, бул. Штефан чел Маре 1..." : "MD-2000, Отделение №1"}
                            required
                            rows={2}
                        />
                    </div>

                    <button type="submit" className="btn-save-profile">
                        Сохранить и перейти к оплате
                    </button>
                </form>
            </div>
        </div>
    );
};