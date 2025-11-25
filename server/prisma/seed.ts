// server/prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
    console.log('🌱 Начинаем посев данных...')

    // 1. Создаем категории (используем upsert, чтобы не создавать дубликаты)
    const blackTea = await db.category.upsert({
        where: { name: 'Черный чай' },
        update: {},
        create: { name: 'Черный чай' }
    })

    const greenTea = await db.category.upsert({
        where: { name: 'Зеленый чай' },
        update: {},
        create: { name: 'Зеленый чай' }
    })

    const herbalTea = await db.category.upsert({
        where: { name: 'Травяной чай' },
        update: {},
        create: { name: 'Травяной чай' }
    })

    // 2. Очищаем старые товары (опционально, чтобы не дублировать при повторном запуске)
    await db.product.deleteMany({})

    // 3. Создаем товары
    await db.product.createMany({
        data: [
            {
                title: 'Earl Grey Premium',
                price: 12.50,
                description: 'Классический черный чай с натуральным маслом бергамота. Насыщенный вкус и яркий аромат.',
                categoryId: blackTea.id,
                stock: 100,
                imageUrl: 'https://images.unsplash.com/photo-1564890369478-c5bc62dde0a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Golden Yunnan',
                price: 15.00,
                description: 'Элитный китайский красный чай с большим содержанием золотых почек. Мягкий вкус с нотками меда.',
                categoryId: blackTea.id,
                stock: 80,
                imageUrl: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Sencha Kyoto',
                price: 18.00,
                description: 'Традиционный японский зеленый чай первого сбора. Свежий травяной вкус и изумрудный цвет настоя.',
                categoryId: greenTea.id,
                stock: 50,
                imageUrl: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Dragon Well (Longjing)',
                price: 22.50,
                description: 'Знаменитый китайский зеленый чай. Плоские листочки, ореховый аромат и сладкое послевкусие.',
                categoryId: greenTea.id,
                stock: 30,
                imageUrl: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                title: 'Альпийские травы',
                price: 10.00,
                description: 'Сбор из мяты, ромашки и лимонной травы. Идеально для вечернего чаепития без кофеина.',
                categoryId: herbalTea.id,
                stock: 120,
                imageUrl: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            }
        ]
    })

    console.log('✅ База данных успешно наполнена!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await db.$disconnect()
    })