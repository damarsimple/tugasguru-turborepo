import { objectType, extendType } from "nexus"
import { Assigment as AssigmentType } from 'nexus-prisma'


export const Assigment = objectType({
    name: AssigmentType.$name,
    description: AssigmentType.$description,
    definition(t) {
        t.field(AssigmentType.id)
        t.field(AssigmentType.name)
        t.field(AssigmentType.subject)
        t.field(AssigmentType.name)
        t.field(AssigmentType.classroom)
        t.field(AssigmentType.yearStart)
        t.field(AssigmentType.yearEnd)
        t.field(AssigmentType.closeAt)
        t.field(AssigmentType.files)
        t.field(AssigmentType.filesType)
        t.field(AssigmentType.odd)
        t.field(AssigmentType.assigmentsubmission)
        t.field(AssigmentType.updatedAt)
        t.field(AssigmentType.createdAt)
    }
})

