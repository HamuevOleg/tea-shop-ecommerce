import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seeding...')

    // Очистка базы перед посевом (аккуратно, удалит все связи)
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()

    // 1. Создаем категории (English + Chinese flavor)
    const agedTea = await prisma.category.create({
        data: { name: 'Aged Shu Pu-erh (熟茶)' },
    })

    const redTea = await prisma.category.create({
        data: { name: 'Yunnan Red (滇红)' },
    })

    const oolong = await prisma.category.create({
        data: { name: 'Rock Oolong (岩茶)' },
    })

    // 2. Создаем товары (English descriptions)
    await prisma.product.create({
        data: {
            title: 'Menghai "Golden Era" 2012 Cake',
            description: 'A deeply aged Shu Pu-erh cake from Menghai factory. Notes of damp earth, aged wood, and a silky, thick liquor. Smooth finish with zero bitterness.',
            price: 89.99,
            stock: 15,
            imageUrl: 'https://images.unsplash.com/photo-1547825407-2d060104b7f8?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Фото пуэрного блина
            categoryId: agedTea.id,
        },
    })

    await prisma.product.create({
        data: {
            title: 'Imperial Golden Bud Dian Hong',
            description: 'The highest grade of Yunnan Red tea, consisting solely of golden buds. Rich, malty sweetness with hints of dark chocolate and honey. A luxurious daily drinker.',
            price: 45.50,
            stock: 50,
            imageUrl: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=800&q=80', // Фото красного чая
            categoryId: redTea.id,
        },
    })

    await prisma.product.create({
        data: {
            title: 'Wuyi Da Hong Pao "Big Red Robe"',
            description: 'Legendary rock oolong from the Wuyi mountains. Heavily roasted over charcoal to produce deep mineral notes, roasted nuts, and a long-lasting floral aftertaste.',
            price: 62.00,
            stock: 25,
            imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80', // Фото улуна
            categoryId: oolong.id,
        },
    })

    await prisma.product.create({
        data: {
            title: 'Ancient Tree Raw Pu-erh 2020',
            description: 'Sheng (Raw) Pu-erh from 300-year-old tea trees in Jingmai mountain. High energy (Cha Qi), prominent orchid aroma, and distinct bitterness that turns sweet quickly.',
            price: 120.00,
            stock: 10,
            imageUrl: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80',
            categoryId: agedTea.id,
        },
    })

    console.log('✅ Database successfully seeded with English data!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })