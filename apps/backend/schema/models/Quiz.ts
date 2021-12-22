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
        t.field(QuizType.coverUrl)
        t.field(QuizType.questions)
        t.field(QuizType.updatedAt)
        t.field(QuizType.createdAt)
    }
})


export const QuizQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('quizes', {
            type: Quiz,
            resolve: (_, args, ctx) => {
                return ctx.prisma.quiz.findMany()
            }
        })
    },
})


