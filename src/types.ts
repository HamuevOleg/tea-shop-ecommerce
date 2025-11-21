export interface Product {
    id: number;
    name: string;
    category: 'Raw Pu-erh' | 'Ripe Pu-erh' | 'Aged Tea';
    price: number;
    year: number;
    description: string;
    imageUrl: string;
}