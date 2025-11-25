// client/src/context/CartContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product } from '../types';

export interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
    totalPrice: number;
    totalItems: number;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Загрузка корзины из LocalStorage при старте
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setItems(JSON.parse(savedCart));
        }
    }, []);

    // Сохранение корзины при каждом изменении
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (product: Product) => {
        setItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                // Если товар уже есть, увеличиваем кол-во
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            // Если нет, добавляем новый
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true); // Автоматически открываем корзину при добавлении
    };

    const removeFromCart = (productId: number) => {
        setItems(prev => prev.filter(item => item.id !== productId));
    };

    const clearCart = () => setItems([]);

    const totalPrice = items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            items, addToCart, removeFromCart, clearCart,
            totalPrice, totalItems,
            isCartOpen, openCart: () => setIsCartOpen(true), closeCart: () => setIsCartOpen(false)
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};