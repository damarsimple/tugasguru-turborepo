
import { objectType, extendType } from "nexus"
import { Absent as AbsentType } from 'nexus-prisma'


export const Absent = objectType({
    name: AbsentType.$name,
    description: AbsentType.$description,
    definition(t) {
        t.field(AbsentType.id)
        t.field(AbsentType.user)
        t.field(AbsentType.target)
        t.field(AbsentType.content)
        t.field(AbsentType.content)
        t.field(AbsentType.description)
        t.field(AbsentType.updatedAt)
        t.field(AbsentType.createdAt)
    }
})


