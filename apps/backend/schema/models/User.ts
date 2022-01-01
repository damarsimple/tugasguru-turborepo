import { objectType, extendType } from "nexus"
import { User as UserType, } from 'nexus-prisma'


export const User = objectType({
    name: UserType.$name,
    description: UserType.$description,
    definition(t) {
        t.field(UserType.id)
        t.field(UserType.email)
        t.field(UserType.name)
        t.field(UserType.username)
        t.field(UserType.balance)
        t.field(UserType.city)
        t.field(UserType.province)
        t.field(UserType.school)
        t.field(UserType.phone)
        t.field(UserType.roles)
        t.field(UserType.address)
        t.field(UserType.coverId)
        t.field(UserType.updatedAt)
        t.field(UserType.createdAt)
    }
})

