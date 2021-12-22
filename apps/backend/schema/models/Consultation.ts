
import { objectType, extendType } from "nexus"
import { Consultation as ConsultationType } from 'nexus-prisma'


export const Consultation = objectType({
    name: ConsultationType.$name,
    description: ConsultationType.$description,
    definition(t) {
        t.field(ConsultationType.id)
        t.field(ConsultationType.user)
        t.field(ConsultationType.status)
        t.field(ConsultationType.consultant)
        t.field(ConsultationType.name)
        t.field(ConsultationType.content)
        t.field(ConsultationType.room)
        t.field(ConsultationType.updatedAt)
        t.field(ConsultationType.createdAt)
    }
})


export const ConsultationQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('consultation', {
            type: Consultation,
            resolve: (_, args, ctx) => {
                return ctx.prisma.consultation.findMany()
            }
        })
    },
})


