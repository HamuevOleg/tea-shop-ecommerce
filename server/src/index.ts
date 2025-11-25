import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { cors } from '@elysiajs/cors'
import { authController } from './controller/auth.controller.ts'
import { orderController } from './controller/order.controller'
import { productController } from './controller/product.controller'

const app = new Elysia()
    .use(swagger({
        documentation: {
            info: {
                title: 'Tea Shop API',
                version: '1.0.0',
                description: 'Tea Shop API Documentation'
            },
            tags: [
                { name: 'Auth', description: 'Authentication' },
                { name: 'Products', description: 'Product Management' },
                { name: 'Orders', description: 'Order Processing' }
            ]
        }
    }))
    .use(cors())
    .use(authController)
    .use(productController) // <--- Added this line
    .use(orderController)
    .listen(3000)

console.log(
    `🍵 Tea Shop Backend is running at ${app.server?.hostname}:${app.server?.port}`
)
console.log(
    `📚 Swagger documentation at http://localhost:3000/swagger`
)