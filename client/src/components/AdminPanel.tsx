// client/src/components/AdminPanel.tsx
import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Product, Category, Order } from '../types';
import './AdminPanel.css';

interface AdminPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

    // Data
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);

    // New product form
    const [newProduct, setNewProduct] = useState({
        title: '',
        price: '',
        description: '',
        imageUrl: '',
        categoryId: 1,
        stock: 100
    });

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen, activeTab]);

    const fetchData = async () => {
        try {
            if (activeTab === 'products') {
                const [prodRes, catRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/categories')
                ]);
                setProducts(prodRes.data);
                setCategories(catRes.data);

                // Set first category as default if available
                if (catRes.data.length > 0 && newProduct.categoryId === 1) {
                    setNewProduct(prev => ({ ...prev, categoryId: catRes.data[0].id }));
                }
            } else {
                const orderRes = await api.get('/orders');
                setOrders(orderRes.data);
            }
        } catch (error) {
            console.error("Error loading admin data:", error);
            alert('Failed to load data. Make sure you are logged in as admin.');
        }
    };

    // Product Logic
    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/products', {
                ...newProduct,
                price: Number(newProduct.price),
                categoryId: Number(newProduct.categoryId),
                stock: Number(newProduct.stock)
            });

            // Reset form and refresh list
            setNewProduct({
                title: '',
                price: '',
                description: '',
                imageUrl: '',
                categoryId: categories[0]?.id || 1,
                stock: 100
            });
            fetchData();
            alert('Product created successfully!');
        } catch (error: any) {
            alert('Error creating product: ' + (error.response?.data?.message || 'Unknown error'));
            console.error(error);
        }
    };

    const handleDeleteProduct = async (id: number) => {
        if (!confirm('Delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            fetchData();
            alert('Product deleted successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to delete product');
        }
    };

    // Order Logic
    const handleStatusChange = async (orderId: number, newStatus: string) => {
        try {
            await api.patch(`/orders/${orderId}`, { status: newStatus });
            fetchData();
            alert('Order status updated!');
        } catch (error) {
            console.error("Failed to update status", error);
            alert('Failed to update order status');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="admin-overlay" onClick={onClose}>
            <div className="admin-modal" onClick={e => e.stopPropagation()}>
                <div className="admin-header">
                    <h2>Admin Dashboard</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="admin-tabs">
                    <button
                        className={activeTab === 'products' ? 'active' : ''}
                        onClick={() => setActiveTab('products')}
                    >
                        Products
                    </button>
                    <button
                        className={activeTab === 'orders' ? 'active' : ''}
                        onClick={() => setActiveTab('orders')}
                    >
                        Orders
                    </button>
                </div>

                <div className="admin-content">
                    {activeTab === 'products' ? (
                        <div className="products-manager">
                            {/* Create Product Form */}
                            <form onSubmit={handleCreateProduct} className="add-product-form">
                                <h3>Add New Tea</h3>
                                <div className="form-row">
                                    <input
                                        placeholder="Product Name"
                                        value={newProduct.title}
                                        onChange={e => setNewProduct({...newProduct, title: e.target.value})}
                                        required
                                    />
                                    <input
                                        placeholder="Price"
                                        type="number"
                                        step="0.01"
                                        value={newProduct.price}
                                        onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-row">
                                    <select
                                        value={newProduct.categoryId}
                                        onChange={e => setNewProduct({...newProduct, categoryId: Number(e.target.value)})}
                                    >
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    <input
                                        placeholder="Stock Quantity"
                                        type="number"
                                        value={newProduct.stock}
                                        onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                                        required
                                    />
                                </div>
                                <input
                                    placeholder="Image URL"
                                    value={newProduct.imageUrl}
                                    onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})}
                                />
                                <textarea
                                    placeholder="Description"
                                    value={newProduct.description}
                                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                                />
                                <button type="submit" className="btn-add">Create Product</button>
                            </form>

                            {/* Products List */}
                            <div className="products-list-admin">
                                <h3 style={{ color: '#d4a373', marginBottom: '15px' }}>Existing Products</h3>
                                {products.map(p => (
                                    <div key={p.id} className="admin-product-row">
                                        <img
                                            src={p.imageUrl || 'https://via.placeholder.com/40'}
                                            alt=""
                                            className="admin-thumb"
                                        />
                                        <span style={{ flex: 1 }}>{p.title}</span>
                                        <span style={{ marginRight: '10px' }}>${Number(p.price).toFixed(2)}</span>
                                        <span style={{ marginRight: '10px', color: '#888' }}>Stock: {p.stock}</span>
                                        <button className="btn-delete" onClick={() => handleDeleteProduct(p.id)}>
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="orders-manager">
                            {orders.length === 0 && <p style={{ color: '#888' }}>No orders yet</p>}
                            {orders.map(order => (
                                <div key={order.id} className="admin-order-card">
                                    <div className="order-header">
                                        <span>Order #{order.id}</span>
                                        <span className="order-user">
                                            User: {order.user?.email || `ID: ${order.userId}`}
                                        </span>
                                        <span className="order-date">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="order-items" style={{ margin: '10px 0' }}>
                                        {order.items && order.items.length > 0 ? (
                                            <div>
                                                {order.items.map(item => (
                                                    <div key={item.id} style={{ fontSize: '0.9rem', color: '#aaa' }}>
                                                        {item.product?.title || 'Unknown Product'} x {item.quantity}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={{ fontSize: '0.9rem', color: '#888' }}>No items</div>
                                        )}
                                        <div style={{ marginTop: '8px', fontWeight: 'bold' }}>
                                            Total: ${Number(order.totalPrice).toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="order-actions">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className={`status-${order.status}`}
                                        >
                                            <option value="PROCESSING">Processing</option>
                                            <option value="SHIPPED">Shipped</option>
                                            <option value="DELIVERED">Delivered</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
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

export default AdminPanel;