
import { objectType, extendType } from "nexus"
import { Examsession as ExamsessionType } from 'nexus-prisma'


export const Examsession = objectType({
    name: ExamsessionType.$name,
    description: ExamsessionType.$description,
    definition(t) {
        t.field(ExamsessionType.id)
        t.field(ExamsessionType.updatedAt)
        t.field(ExamsessionType.createdAt)
        t.field(ExamsessionType.examplayers)
        t.field(ExamsessionType.name)
        t.field(ExamsessionType.token)
        t.field(ExamsessionType.exam)
        t.field(ExamsessionType.openAt)
        t.field(ExamsessionType.closeAt)
    }
})


export const ExamsessionQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('examssessions', {
            type: Examsession,
            resolve: (_, args, ctx) => {
                return ctx.prisma.examsession.findMany()
            }
        })
    },
})


