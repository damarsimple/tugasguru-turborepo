
import { objectType, extendType } from "nexus"
import { Examplay as ExamplayType } from 'nexus-prisma'


export const Examplay = objectType({
    name: ExamplayType.$name,
    description: ExamplayType.$description,
    definition(t) {
        t.field(ExamplayType.id)
        // t.field(ExamplayType.exam)
        // t.field(ExamplayType.examsession)
        t.field(ExamplayType.user)
        t.field(ExamplayType.score)
        t.field(ExamplayType.timePassed)
        t.field(ExamplayType.lastActivity)
        t.field(ExamplayType.startAt)
        t.field(ExamplayType.finishAt)
        t.field(ExamplayType.grade)
        t.field(ExamplayType.graded)
        // t.field(ExamplayType.answersMap)
        t.field(ExamplayType.updatedAt)
        t.field(ExamplayType.createdAt)
    }
})


