
import { objectType, extendType } from "nexus"
import { Agenda as AgendaType } from 'nexus-prisma'


export const Agenda = objectType({
    name: AgendaType.$name,
    description: AgendaType.$description,
    definition(t) {
        t.field(AgendaType.id)
        t.field(AgendaType.user)
        t.field(AgendaType.uuid)
        t.field(AgendaType.content)
        t.field(AgendaType.exam)
        t.field(AgendaType.tutoring)
        t.field(AgendaType.meetings)
        t.field(AgendaType.fromDate)
        t.field(AgendaType.toDate)
        t.field(AgendaType.updatedAt)
        t.field(AgendaType.createdAt)
    }
})


export const AgendaQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('agendas', {
            type: Agenda,
            resolve: (_, args, ctx) => {
                return ctx.prisma.agenda.findMany()
            }
        })
    },
})


