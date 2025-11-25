import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Create Categories
    const blackTea = await prisma.category.upsert({
        where: { name: 'Black Tea' },
        update: {},
        create: { name: 'Black Tea' },
    })

    const greenTea = await prisma.category.upsert({
        where: { name: 'Green Tea' },
        update: {},
        create: { name: 'Green Tea' },
    })

    // Create Products
    await prisma.product.createMany({
        data: [
            {
                title: 'Earl Grey Premium',
                description: 'Classic black tea with bergamot oil.',
                price: 12.50,
                stock: 100,
                categoryId: blackTea.id,
                imageUrl: 'https://www.thewhistlingkettle.com/cdn/shop/files/EarlGreyDisplayPhoto01.jpg?v=1726087929&width=1024'
            },
            {
                title: 'Jasmine Green',
                description: 'Refreshing green tea infused with jasmine flowers.',
                price: 14.00,
                stock: 50,
                categoryId: greenTea.id,
                imageUrl: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'English Breakfast',
                description: 'Strong and full-bodied black tea.',
                price: 10.00,
                stock: 200,
                categoryId: blackTea.id,
                imageUrl: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80'
            }
        ]
    })

    console.log('🌱 Database seeded!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })