// client/src/types.ts

// --- Типы для авторизации (ЭТОГО НЕ ХВАТАЛО) ---
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

// --- Типы для товаров ---
export interface Product {
    id: number;
    title: string;       // Обратите внимание: title, а не name (как на бэке)
    price: number;
    description: string | null;
    category: {
        id: number;
        name: string;
    };
    imageUrl?: string | null;
    stock?: number;
}