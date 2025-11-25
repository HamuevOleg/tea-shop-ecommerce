import { Elysia, t } from 'elysia'
import { db } from '../db'

export const productController = new Elysia()
    .get('/products', async ({ set }) => {
        try {
            const products = await db.product.findMany({
                include: {
                    category: true
                },
                orderBy: {
                    id: 'asc'
                }
            })
            return products
        } catch (error) {
            console.error('Error fetching products:', error)
            set.status = 500
            return { success: false, message: 'Failed to fetch products' }
        }
    })
    .get('/products/:id', async ({ params: { id }, set }) => {
        try {
            const product = await db.product.findUnique({
                where: { id: Number(id) },
                include: { category: true }
            })

            if (!product) {
                set.status = 404
                return { success: false, message: 'Product not found' }
            }

            return product
        } catch (error) {
            set.status = 500
            return { success: false, message: 'Failed to fetch product' }
        }
    })