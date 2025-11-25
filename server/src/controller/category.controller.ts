// server/src/controller/category.controller.ts
import { Elysia } from 'elysia'
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

export const categoryController = new Elysia({ prefix: '/categories' })
    // GET /categories - получить список всех категорий
    .get('/', async () => {
        try {
            const categories = await db.category.findMany()
            return categories
        } catch (error) {
            console.error('Error fetching categories:', error)
            return { error: 'Failed to fetch categories' }
        }
    })