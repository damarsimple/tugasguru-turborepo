import { objectType, extendType } from "nexus"
import { School as SchoolType } from 'nexus-prisma'


export const School = objectType({
    name: SchoolType.$name,
    description: SchoolType.$description,
    definition(t) {
        t.field(SchoolType.id)
        t.field(SchoolType.name)
        t.field(SchoolType.address)
        t.field(SchoolType.npsn)
        t.field(SchoolType.city)
        t.field(SchoolType.province)

        t.field(SchoolType.updatedAt)
        t.field(SchoolType.createdAt)

    }
})


