import { objectType, extendType } from "nexus"
import { Classtype as ClasstypeType } from 'nexus-prisma'


export const Classtype = objectType({
    name: ClasstypeType.$name,
    description: ClasstypeType.$description,
    definition(t) {
        t.field(ClasstypeType.id)
        t.field(ClasstypeType.level)

        t.field(ClasstypeType.updatedAt)
        t.field(ClasstypeType.createdAt)
    }
})


export const ClasstypeQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('classtypes', {
            type: Classtype,
            resolve: (_, args, ctx) => {
                return ctx.prisma.classtype.findMany()
            }
        })
    },
})


