// client/src/components/SuccessModal.tsx
import React from 'react';
import './SuccessModal.css';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    address?: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, address }) => {
    if (!isOpen) return null;

    return (
        <div className="success-overlay">
            <div className="success-card">
                <div className="success-icon-container">
                    <span className="success-icon">✨</span>
                </div>

                <h2 className="success-title">Order Confirmed!</h2>

                <p className="success-message">
                    Thank you for choosing Yunnan Soul.
                    <br />
                    Your tea is being carefully prepared and will be shipped to:
                    <br /><br />
                    <span className="success-address">{address || 'your address'}</span>
                </p>

                <button className="btn-success-close" onClick={onClose}>
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};