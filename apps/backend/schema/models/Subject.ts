import { objectType, extendType } from "nexus"
import { Subject as SubjectType } from 'nexus-prisma'


export const Subject = objectType({
    name: SubjectType.$name,
    description: SubjectType.$description,
    definition(t) {
        t.field(SubjectType.id)
        t.field(SubjectType.name)
        t.field(SubjectType.description)
        t.field(SubjectType.updatedAt)
        t.field(SubjectType.createdAt)
    }
})


