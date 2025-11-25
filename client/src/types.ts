// client/src/types.ts
export type Role = 'USER' | 'ADMIN';
export type DeliveryMethod = 'COURIER' | 'POST';

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

export interface AuthResponse {
    success: boolean;
    token: string;
    user: User;
}

export interface Category {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    title: string;
    price: number;
    description: string | null;
    categoryId: number;
    category?: Category;
    imageUrl?: string | null;
    stock?: number;
}

export interface CartItem {
    product: Product;
    quantity: number;
}