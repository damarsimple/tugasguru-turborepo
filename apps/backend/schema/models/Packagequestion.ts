import { objectType, extendType } from "nexus"
import { Packagequestion as PackagequestionType } from 'nexus-prisma'


export const Packagequestion = objectType({
    name: PackagequestionType.$name,
    description: PackagequestionType.$description,
    definition(t) {
        t.field(PackagequestionType.id)
        t.field(PackagequestionType.user)
        t.field(PackagequestionType.subject)
        t.field(PackagequestionType.visibility)
        t.field(PackagequestionType.classtype)
        t.field(PackagequestionType.coverId)
        t.field(PackagequestionType.questions)
        t.field(PackagequestionType.updatedAt)
        t.field(PackagequestionType.createdAt)
    }
})


