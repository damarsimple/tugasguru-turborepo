import { objectType, extendType } from "nexus"
import { Quizplayer as QuizplayerType } from 'nexus-prisma'


export const Quizplayer = objectType({
    name: QuizplayerType.$name,
    description: QuizplayerType.$description,
    definition(t) {
        t.field(QuizplayerType.id)
        t.field(QuizplayerType.user)
        t.field(QuizplayerType.quiz)
        t.field(QuizplayerType.quizmatch)
        t.field(QuizplayerType.score)
        t.field(QuizplayerType.streak)
        // t.field(QuizplayerType.answersMap)
        t.field(QuizplayerType.updatedAt)
        t.field(QuizplayerType.createdAt)
    }
})


export const QuizplayerQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('quizplayers', {
            type: Quizplayer,
            resolve: (_, args, ctx) => {
                return ctx.prisma.quizplayer.findMany()
            }
        })
    },
})


