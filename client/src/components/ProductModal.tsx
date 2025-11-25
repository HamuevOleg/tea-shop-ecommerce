// client/src/components/ProductModal.tsx
import React from 'react';
import type { Product } from '../types';
import './ProductModal.css';

interface ProductModalProps {
    product: Product;
    onClose: () => void;
    onActionButtonClick: (product: Product) => void;
    isUserLoggedIn: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
                                                              product,
                                                              onClose,
                                                              onActionButtonClick,
                                                              isUserLoggedIn
                                                          }) => {
    // Закрытие по клику на фон
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content-premium">
                <button className="modal-close-btn" onClick={onClose}>×</button>

                {/* Левая колонка - Фото */}
                <div className="modal-image-section">
                    <img
                        src={product.imageUrl || 'https://via.placeholder.com/600x800?text=Tea+Image'}
                        alt={product.title}
                    />
                </div>

                {/* Правая колонка - Инфо */}
                <div className="modal-info-section">
                    <span className="modal-category-tag">
                        {product.category?.name || 'Premium Tea'}
                    </span>

                    <h2 className="modal-title-premium">{product.title}</h2>

                    <p className="modal-description-premium">
                        {product.description || "No description available for this exclusive item."}
                    </p>

                    <div className="modal-footer-premium">
                        <div className="modal-price-premium">
                            ${Number(product.price).toFixed(2)}
                        </div>

                        <button
                            className="btn-primary"
                            style={{ padding: '1rem 2rem', fontSize: '1rem' }}
                            onClick={() => onActionButtonClick(product)}
                        >
                            {isUserLoggedIn ? 'Add to Cart' : 'Sign In to Buy'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};