export type Role = 'USER' | 'ADMIN';

export interface User {
    id: number;
    email: string;
    role: Role;
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