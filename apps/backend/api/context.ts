import { PrismaClient, User } from "@prisma/client"

export const prisma = new PrismaClient({

})

export interface Context {
    prisma: PrismaClient
    user?: Partial<User>
}

export const context = {
    prisma
}
