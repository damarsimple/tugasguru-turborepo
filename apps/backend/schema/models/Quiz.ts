import { objectType, extendType } from "nexus"
import { Quiz as QuizType } from 'nexus-prisma'


export const Quiz = objectType({
    name: QuizType.$name,
    description: QuizType.$description,
    definition(t) {
        t.field(QuizType.id)
        t.field(QuizType.name)
        t.field(QuizType.user)
        t.field(QuizType.subject)
        t.field(QuizType.playedCount)
        t.field(QuizType.difficulty)
        t.field(QuizType.visibility)
        t.field(QuizType.coverId)
        t.field(QuizType.questions)
        t.field(QuizType.updatedAt)
        t.field(QuizType.createdAt)
    }
})


