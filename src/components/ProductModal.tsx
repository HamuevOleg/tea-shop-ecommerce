import { Product } from '../types';
import './ProductModal.css';

interface ProductModalProps {
    product: Product;
    onClose: () => void;
    onAddToCart: (product: Product) => void;
}

function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleAddToCart = () => {
        onAddToCart(product);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>
                    ✕
                </button>

                <div className="modal-grid">
                    <div className="modal-image-container">
                        <img src={product.imageUrl} alt={product.name} className="modal-image" />
                    </div>

                    <div className="modal-details">
                        <span className="modal-category">{product.category}</span>
                        <h2 className="modal-title">{product.name}</h2>
                        <span className="modal-year">{product.year} Harvest</span>

                        <p className="modal-description">{product.description}</p>

                        <div className="modal-features">
                            <h3>Brewing Notes</h3>
                            <ul>
                                <li>Water Temperature: 95-100°C</li>
                                <li>Steep Time: 15-30 seconds</li>
                                <li>Multiple Infusions: 8-12 steeps</li>
                            </ul>
                        </div>

                        <div className="modal-footer">
                            <div className="modal-price">${product.price.toFixed(2)}</div>
                            <button className="modal-add-btn" onClick={handleAddToCart}>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductModal;