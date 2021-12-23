import { objectType, extendType } from "nexus"
import { Report as ReportType } from 'nexus-prisma'


export const Report = objectType({
    name: ReportType.$name,
    description: ReportType.$description,
    definition(t) {
        t.field(ReportType.id)
        t.field(ReportType.user)
        t.field(ReportType.receiver)
        t.field(ReportType.name)
        t.field(ReportType.subject)
        t.field(ReportType.content)
        t.field(ReportType.status)
        t.field(ReportType.room)
        t.field(ReportType.updatedAt)
        t.field(ReportType.createdAt)
    }
})


export const ReportQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('reports', {
            type: Report,
            resolve: (_, args, ctx) => {
                return ctx.prisma.report.findMany()
            }
        })
    },
})


