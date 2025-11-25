import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Product, Category, Order } from '../types'; // Убедись, что Order есть в types.ts
import './AdminPanel.css';

interface AdminPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

    // Данные
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);

    // Форма добавления товара
    const [newProduct, setNewProduct] = useState({
        title: '',
        price: '',
        description: '',
        imageUrl: '',
        categoryId: 1 // ID первой категории по умолчанию
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
            } else {
                const orderRes = await api.get('/orders'); // Бэкенд должен поддерживать GET /orders для админа
                setOrders(orderRes.data);
            }
        } catch (error) {
            console.error("Ошибка загрузки данных админки:", error);
        }
    };

    // --- Логика Товаров ---
    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/products', {
                ...newProduct,
                price: Number(newProduct.price),
                categoryId: Number(newProduct.categoryId)
            });
            // Сброс формы и обновление списка
            setNewProduct({ title: '', price: '', description: '', imageUrl: '', categoryId: categories[0]?.id || 1 });
            fetchData();
        } catch (error) {
            alert('Ошибка создания товара');
            console.error(error);
        }
    };

    const handleDeleteProduct = async (id: number) => {
        if (!confirm('Удалить этот товар?')) return;
        try {
            await api.delete(`/products/${id}`);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    // --- Логика Заказов ---
    const handleStatusChange = async (orderId: number, newStatus: string) => {
        try {
            await api.patch(`/orders/${orderId}`, { status: newStatus });
            fetchData(); // Обновить список
        } catch (error) {
            console.error("Не удалось обновить статус", error);
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
                        Товары
                    </button>
                    <button
                        className={activeTab === 'orders' ? 'active' : ''}
                        onClick={() => setActiveTab('orders')}
                    >
                        Заказы
                    </button>
                </div>

                <div className="admin-content">
                    {activeTab === 'products' ? (
                        <div className="products-manager">
                            {/* Форма добавления */}
                            <form onSubmit={handleCreateProduct} className="add-product-form">
                                <h3>Добавить новый чай</h3>
                                <div className="form-row">
                                    <input
                                        placeholder="Название"
                                        value={newProduct.title}
                                        onChange={e => setNewProduct({...newProduct, title: e.target.value})}
                                        required
                                    />
                                    <input
                                        placeholder="Цена"
                                        type="number"
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
                                        placeholder="Ссылка на картинку"
                                        value={newProduct.imageUrl}
                                        onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})}
                                    />
                                </div>
                                <textarea
                                    placeholder="Описание"
                                    value={newProduct.description}
                                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                                />
                                <button type="submit" className="btn-add">Создать товар</button>
                            </form>

                            {/* Список товаров */}
                            <div className="products-list-admin">
                                {products.map(p => (
                                    <div key={p.id} className="admin-product-row">
                                        <img src={p.imageUrl} alt="" className="admin-thumb"/>
                                        <span>{p.title}</span>
                                        <span>{p.price} ₽</span>
                                        <button className="btn-delete" onClick={() => handleDeleteProduct(p.id)}>Удалить</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="orders-manager">
                            {orders.length === 0 && <p>Заказов пока нет</p>}
                            {orders.map(order => (
                                <div key={order.id} className="admin-order-card">
                                    <div className="order-header">
                                        <span>Заказ #{order.id}</span>
                                        <span className="order-user">User ID: {order.userId}</span>
                                        <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="order-items">
                                        {/* Если бэкенд возвращает items внутри order, раскомментируй: */}
                                        {/* {order.items?.map(item => (
                                            <div key={item.id}>{item.product.title} x {item.quantity}</div>
                                        ))} */}
                                        <div>Сумма: {order.totalPrice} ₽</div>
                                    </div>
                                    <div className="order-actions">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className={`status-${order.status}`}
                                        >
                                            <option value="PROCESSING">В обработке</option>
                                            <option value="SHIPPED">Отправлен</option>
                                            <option value="DELIVERED">Доставлен</option>
                                            <option value="CANCELLED">Отменен</option>
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