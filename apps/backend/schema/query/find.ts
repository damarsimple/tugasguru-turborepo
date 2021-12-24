import { extendType } from "nexus"
import { User } from "../models"

export const AbsentQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nullable.field('me', {
            type: User,
            authorize: (_, __, ctx) => ctx.isLogged,
            resolve: async (_, __, ctx) => {
                if (ctx.user?.id) {
                    const user = await ctx.prisma.user.findUnique({
                        where: {
                            id: ctx.user?.id
                        }
                    })
                    return user
                }

                return null
            }
        })
    },
})


