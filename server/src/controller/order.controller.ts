import { Elysia, t } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { db } from '../db'

export const orderController = new Elysia()
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRET || 'secret'
        })
    )
    .post(
        '/orders',
        async ({ body, jwt, set, headers }) => {
            const authHeader = headers['authorization']
            if (!authHeader) {
                set.status = 401
                return { success: false, message: 'Unauthorized' }
            }

            const token = authHeader.split(' ')[1]
            const profile = await jwt.verify(token)

            if (!profile) {
                set.status = 401
                return { success: false, message: 'Invalid token' }
            }

            const userId = (profile as any).id

            if (body.items.length === 0) {
                set.status = 400
                return { success: false, message: 'Cart is empty' }
            }

            try {
                const order = await db.$transaction(async (tx) => {
                    let totalPrice = 0
                    const orderItemsData = []

                    for (const item of body.items) {
                        const product = await tx.product.findUnique({
                            where: { id: item.productId }
                        })

                        if (!product) {
                            throw new Error(`Product ${item.productId} not found`)
                        }

                        if (product.stock < item.quantity) {
                            throw new Error(`Not enough stock for ${product.title}`)
                        }

                        const price = Number(product.price)
                        totalPrice += price * item.quantity

                        orderItemsData.push({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: product.price
                        })

                        await tx.product.update({
                            where: { id: item.productId },
                            data: { stock: product.stock - item.quantity }
                        })
                    }

                    const newOrder = await tx.order.create({
                        data: {
                            userId: Number(userId),
                            totalPrice: totalPrice,
                            status: 'PROCESSING',
                            items: {
                                create: orderItemsData
                            }
                        },
                        include: {
                            items: true
                        }
                    })

                    return newOrder
                })

                return { success: true, order }
            } catch (error) {
                set.status = 400
                return {
                    success: false,
                    message: error instanceof Error ? error.message : 'Order failed'
                }
            }
        },
        {
            body: t.Object({
                items: t.Array(
                    t.Object({
                        productId: t.Number(),
                        quantity: t.Number()
                    })
                )
            })
        }
    )