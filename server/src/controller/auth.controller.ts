import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client'
import { password as bunPassword } from 'bun'

const db = new PrismaClient()

export const authController = new Elysia({ prefix: '/auth' })
    .post('/register', async ({ body, set }) => {
        const { email, password } = body

        const existing = await db.user.findUnique({ where: { email } })
        if (existing) {
            set.status = 400
            return { message: 'User already exists' }
        }

        const hashedPassword = await bunPassword.hash(password)

        const user = await db.user.create({
            data: {
                email,
                password: hashedPassword
            }
        })

        return { success: true, message: 'User created' }
    }, {
        body: t.Object({
            email: t.String(),
            password: t.String()
        })
    })

    .post('/login', async ({ body, set }) => {
        const { email, password } = body

        const user = await db.user.findUnique({ where: { email } })
        if (!user) {
            set.status = 400
            return { message: 'Invalid credentials' }
        }

        const isMatch = await bunPassword.verify(password, user.password)
        if (!isMatch) {
            set.status = 400
            return { message: 'Invalid credentials' }
        }

        const token = 'fake-jwt-token-' + user.id

        const { password: _, ...userWithoutPassword } = user

        return {
            success: true,
            token,
            user: userWithoutPassword
        }
    }, {
        body: t.Object({
            email: t.String(),
            password: t.String()
        })
    })

    .put('/profile', async ({ body, set }) => {
        const { id, name, phone, idnp, address, deliveryMethod, avatarUrl } = body

        try {
            // @ts-ignore
            const updateData: any = {}

            if (name !== undefined) updateData.name = name
            if (phone !== undefined) updateData.phone = phone
            if (idnp !== undefined) updateData.idnp = idnp
            if (address !== undefined) updateData.address = address
            if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl
            if (deliveryMethod !== undefined) updateData.deliveryMethod = deliveryMethod

            const updatedUser = await db.user.update({
                where: { id: Number(id) },
                data: updateData
            })

            const { password: _, ...userWithoutPassword } = updatedUser
            return { success: true, user: userWithoutPassword }

        } catch (error) {
            console.error('Profile update error:', error)
            set.status = 400
            return { success: false, message: "Could not update profile", error: String(error) }
        }
    }, {
        body: t.Object({
            id: t.Number(),
            name: t.Optional(t.String()),
            phone: t.Optional(t.String()),
            idnp: t.Optional(t.String()),
            address: t.Optional(t.String()),
            deliveryMethod: t.Optional(t.String()),
            avatarUrl: t.Optional(t.String())
        })
    })