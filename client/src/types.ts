// client/src/types.ts

// --- Enums / Типы статусов ---
export type Role = 'USER' | 'ADMIN';

export type DeliveryMethod = 'COURIER' | 'POST';

export type OrderStatus = 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

// --- Пользователь ---
export interface User {
    id: number;
    email: string;
    role: Role;
    name?: string;
    phone?: string;
    idnp?: string;
    address?: string;
    deliveryMethod?: DeliveryMethod;
    avatarUrl?: string;
}

// --- Ответ при авторизации ---
export interface AuthResponse {
    success?: boolean;
    token: string;
    user: User;
}

// --- Категория ---
export interface Category {
    id: number;
    name: string;
}

// --- Товар ---
export interface Product {
    id: number;
    title: string;
    price: number;
    description: string | null;
    imageUrl: string | null;
    stock: number;
    categoryId: number;
    category?: Category; // Опционально, если бэк заполняет relation
    createdAt?: string;
}

// --- Элемент Корзины (Frontend only) ---
export interface CartItem {
    product: Product;
    quantity: number;
}

// --- Элемент Заказа (из БД) ---
export interface OrderItem {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number; // Цена на момент покупки
    product?: Product; // Для отображения названия товара в истории
}

// --- Заказ ---
export interface Order {
    id: number;
    userId: number;
    status: OrderStatus;
    totalPrice: number;
    createdAt: string; // JSON возвращает дату как строку
    items?: OrderItem[];
    user?: User; // Для админки, чтобы видеть чьё это
}