import { objectType, extendType } from "nexus"
import { District as DistrictType } from 'nexus-prisma'


export const District = objectType({
    name: DistrictType.$name,
    description: DistrictType.$description,
    definition(t) {
        t.field(DistrictType.id)
        t.field(DistrictType.name)
        t.field(DistrictType.city)
        t.field(DistrictType.updatedAt)
        t.field(DistrictType.createdAt)
    }
})


