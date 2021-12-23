import { objectType, extendType } from "nexus"
import { Quizmatch as QuizmatchType } from 'nexus-prisma'


export const Quizmatch = objectType({
    name: QuizmatchType.$name,
    description: QuizmatchType.$description,
    definition(t) {
        t.field(QuizmatchType.id)
        t.field(QuizmatchType.user)
        t.field(QuizmatchType.quiz)
        t.field(QuizmatchType.password)
        t.field(QuizmatchType.startAt)
        t.field(QuizmatchType.finishAt)
        t.field(QuizmatchType.room)
        t.field(QuizmatchType.quizplayers)
        t.field(QuizmatchType.updatedAt)
        t.field(QuizmatchType.createdAt)
    }
})


