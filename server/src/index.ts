// server/src/index.ts
import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { cors } from '@elysiajs/cors'
import { authController } from './controller/auth.controller'
// import { db } from './db' // Пока не используем напрямую здесь, но пригодится

const app = new Elysia()
    // 1. Документация Swagger
    .use(swagger({
        documentation: {
            info: {
                title: 'Tea Shop API',
                version: '1.0.0',
                description: 'API для магазина чая'
            },
            tags: [
                { name: 'Auth', description: 'Регистрация и вход' },
                { name: 'Products', description: 'Товары (Скоро)' }
            ]
        }
    }))
    // 2. CORS (чтобы фронтенд мог делать запросы)
    .use(cors())

    // 3. Подключаем наши контроллеры
    .use(authController)

    .listen(3000)

console.log(
    `🍵 Tea Shop Backend is running at ${app.server?.hostname}:${app.server?.port}`
)
console.log(
    `📚 Swagger documentation at http://localhost:3000/swagger`
)