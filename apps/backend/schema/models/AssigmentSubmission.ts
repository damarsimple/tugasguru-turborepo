import { objectType, extendType } from "nexus"
import { AssigmentSubmission as AssigmentSubmissionType } from 'nexus-prisma'


export const AssigmentSubmission = objectType({
    name: AssigmentSubmissionType.$name,
    description: AssigmentSubmissionType.$description,
    definition(t) {
        t.field(AssigmentSubmissionType.id)
        t.field(AssigmentSubmissionType.assigment)
        t.field(AssigmentSubmissionType.user)
        t.field(AssigmentSubmissionType.grade)
        t.field(AssigmentSubmissionType.graded)
        t.field(AssigmentSubmissionType.editedTimes)
        t.field(AssigmentSubmissionType.turned)
        t.field(AssigmentSubmissionType.turnedAt)
        t.field(AssigmentSubmissionType.files)
        t.field(AssigmentSubmissionType.filesType)
        t.field(AssigmentSubmissionType.updatedAt)
        t.field(AssigmentSubmissionType.createdAt)
    }
})
