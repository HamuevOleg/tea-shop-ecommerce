import type {Product} from './types';

export const products: Product[] = [
    {
        id: 1,
        name: "Old Comrade Ripe Cake",
        category: "Ripe Pu-erh",
        price: 45.00,
        year: 2018,
        description: "Deep, earthy flavor with notes of dried dates and wood. Smooth texture.",
        imageUrl: "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 2,
        name: "Ancient Spirit Raw Gushu",
        category: "Raw Pu-erh",
        price: 120.50,
        year: 2012,
        description: "Harvested from 300-year-old trees. Intense energy (Cha Qi) and floral finish.",
        imageUrl: "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        id: 3,
        name: "Golden Bud Brick",
        category: "Ripe Pu-erh",
        price: 32.00,
        year: 2020,
        description: "High content of golden buds. Sweet, creamy, and very forgiving to brew.",
        imageUrl: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 4,
        name: "Purple Haze Wild Leaf",
        category: "Raw Pu-erh",
        price: 85.00,
        year: 2019,
        description: "Rare purple leaf varietal. Unique bitterness transforming into lasting sweetness.",
        imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600"
    }
];