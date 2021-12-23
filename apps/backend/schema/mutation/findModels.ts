import { extendType } from "nexus"
import { Agenda } from "../models/Agenda"

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


