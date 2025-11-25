// server/src/controllers/auth.controller.ts
import { Elysia, t } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { db } from '../db'

export const authController = new Elysia({ prefix: '/auth' })
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRET || 'secret'
        })
    )
    // --- РЕГИСТРАЦИЯ ---
    .post('/register', async ({ body, error }) => {
        // 1. Проверяем, есть ли такой email
        const existingUser = await db.user.findUnique({
            where: { email: body.email }
        })

        if (existingUser) {
            return error(400, 'User already exists')
        }

        // 2. Хешируем пароль (Bun делает это одной строчкой)
        const hashedPassword = await Bun.password.hash(body.password)

        // 3. Создаем пользователя
        const newUser = await db.user.create({
            data: {
                email: body.email,
                password: hashedPassword,
                role: 'USER' // По умолчанию роль USER
            }
        })

        return {
            success: true,
            message: 'User registered successfully',
            user: { id: newUser.id, email: newUser.email }
        }
    }, {
        // Валидация входных данных
        body: t.Object({
            email: t.String({ format: 'email' }),
            password: t.String({ minLength: 6 })
        }),
        detail: { tags: ['Auth'] }
    })

    // --- ЛОГИН ---
    .post('/login', async ({ body, jwt, error }) => {
        // 1. Ищем пользователя
        const user = await db.user.findUnique({
            where: { email: body.email }
        })

        if (!user) {
            return error(401, 'Invalid credentials')
        }

        // 2. Проверяем пароль
        const isMatch = await Bun.password.verify(body.password, user.password)

        if (!isMatch) {
            return error(401, 'Invalid credentials')
        }

        // 3. Генерируем токен
        const token = await jwt.sign({
            id: user.id,
            email: user.email,
            role: user.role
        })

        return {
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        }
    }, {
        body: t.Object({
            email: t.String(),
            password: t.String()
        }),
        detail: { tags: ['Auth'] }
    })