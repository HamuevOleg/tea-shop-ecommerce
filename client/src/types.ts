// client/src/types.ts
export type Role = 'USER' | 'ADMIN';
export type DeliveryMethod = 'COURIER' | 'POST';

export interface User {
    id: number;
    email: string;
    role: Role;
    // Новые поля
    name?: string;
    phone?: string;
    idnp?: string;
    address?: string;
    deliveryMethod?: DeliveryMethod;
    avatarUrl?: string;
}

export interface AuthResponse {
    success: boolean;
    token: string;
    user: User;
}

export interface Product {
    id: number;
    title: string;
    price: number;
    description: string | null;
    category: {
        id: number;
        name: string;
    };
    imageUrl?: string | null;
    stock?: number;
}

export interface CartItem {
    product: Product;
    quantity: number;
}