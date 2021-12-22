import { objectType, extendType } from "nexus"
import { User as UserType, } from 'nexus-prisma'


export const User = objectType({
    name: UserType.$name,
    description: UserType.$description,
    definition(t) {
        // objectSchemaExtractor(User, t.field)
        t.field(UserType.id)
        t.field(UserType.email)
        t.field(UserType.name)
        t.field(UserType.username)
        t.field(UserType.balance)
        t.field(UserType.city)
        t.field(UserType.district)
        t.field(UserType.province)
        t.field(UserType.school)

        t.field(UserType.phone)
        t.field(UserType.address)

        t.field(UserType.updatedAt)
        t.field(UserType.createdAt)
    }
})

export const UserQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('users', {
            type: User,
            resolve: (_, args, ctx) => {
                return ctx.prisma.user.findMany()
            }
        })
    },
})


