import { objectType, extendType } from "nexus"
import { Question as QuestionType } from 'nexus-prisma'


export const Question = objectType({
    name: QuestionType.$name,
    description: QuestionType.$description,
    definition(t) {
        t.field(QuestionType.id)
        t.field(QuestionType.user)
        t.field(QuestionType.subject)
        t.field(QuestionType.files)
        t.field(QuestionType.filesType)
        t.field(QuestionType.classtype)
        t.field(QuestionType.answers)
        t.field(QuestionType.answersDocuments)
        t.field(QuestionType.answersTypes)
        t.field(QuestionType.correctAnswerIndex)
        t.field(QuestionType.visibility)
        t.field(QuestionType.updatedAt)
        t.field(QuestionType.createdAt)
    }
})



