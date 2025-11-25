import type { Product } from '../types';
import './ProductModal.css';

interface ProductModalProps {
    product: Product;
    onClose: () => void;
    onAddToCart: (product: Product) => void;
}

export const ProductModal = ({ product, onClose, onAddToCart }: ProductModalProps) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>

                <div className="modal-body">
                    <div className="modal-image">
                        {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.title} />
                        ) : (
                            <div className="placeholder-image">🍵</div>
                        )}
                    </div>

                    <div className="modal-info">
                        <span className="modal-category">{product.category.name}</span>
                        <h2>{product.title}</h2>
                        <p className="modal-description">{product.description}</p>

                        <div className="modal-footer">
                            <span className="modal-price">${Number(product.price).toFixed(2)}</span>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    onAddToCart(product);
                                    onClose();
                                }}
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};