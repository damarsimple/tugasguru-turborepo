
import { objectType, extendType } from "nexus"
import { Exam as ExamType } from 'nexus-prisma'


export const Exam = objectType({
    name: ExamType.$name,
    description: ExamType.$description,
    definition(t) {
        t.field(ExamType.id)
        t.field(ExamType.subject)
        t.field(ExamType.examplayers)
        t.field(ExamType.questions)
        t.field(ExamType.name)
        t.field(ExamType.classroom)
        t.field(ExamType.odd)
        t.field(ExamType.hint)
        t.field(ExamType.description)
        t.field(ExamType.timeLimit)
        t.field(ExamType.yearStart)
        t.field(ExamType.yearEnd)
        t.field(ExamType.shuffle)
        t.field(ExamType.showResult)
        t.field(ExamType.examsessions)
        t.field(ExamType.supervisors)
        t.field(ExamType.agenda)
        t.field(ExamType.classtype)
        t.field(ExamType.updatedAt)
        t.field(ExamType.createdAt)
    }
})



