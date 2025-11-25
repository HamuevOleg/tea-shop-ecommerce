// server/src/controller/product.controller.ts
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

    // CREATE new product (Admin only)
    .post('/products', async ({ body, set }) => {
        try {
            const product = await db.product.create({
                data: {
                    title: body.title,
                    description: body.description || null,
                    price: body.price,
                    stock: body.stock || 0,
                    imageUrl: body.imageUrl || null,
                    categoryId: body.categoryId
                },
                include: {
                    category: true
                }
            })

            return { success: true, product }
        } catch (error) {
            console.error('Error creating product:', error)
            set.status = 400
            return { success: false, message: 'Failed to create product' }
        }
    }, {
        body: t.Object({
            title: t.String(),
            description: t.Optional(t.String()),
            price: t.Number(),
            stock: t.Optional(t.Number()),
            imageUrl: t.Optional(t.String()),
            categoryId: t.Number()
        })
    })

    // DELETE product (Admin only)
    .delete('/products/:id', async ({ params: { id }, set }) => {
        try {
            await db.product.delete({
                where: { id: Number(id) }
            })

            return { success: true, message: 'Product deleted' }
        } catch (error) {
            console.error('Error deleting product:', error)
            set.status = 400
            return { success: false, message: 'Failed to delete product' }
        }
    })

    // UPDATE product (Admin only)
    .patch('/products/:id', async ({ params: { id }, body, set }) => {
        try {
            const product = await db.product.update({
                where: { id: Number(id) },
                data: {
                    title: body.title,
                    description: body.description,
                    price: body.price,
                    stock: body.stock,
                    imageUrl: body.imageUrl,
                    categoryId: body.categoryId
                },
                include: {
                    category: true
                }
            })

            return { success: true, product }
        } catch (error) {
            console.error('Error updating product:', error)
            set.status = 400
            return { success: false, message: 'Failed to update product' }
        }
    }, {
        body: t.Object({
            title: t.Optional(t.String()),
            description: t.Optional(t.String()),
            price: t.Optional(t.Number()),
            stock: t.Optional(t.Number()),
            imageUrl: t.Optional(t.String()),
            categoryId: t.Optional(t.Number())
        })
    })