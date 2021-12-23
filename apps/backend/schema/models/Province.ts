import { objectType, extendType } from "nexus"
import { Province as ProvinceType } from 'nexus-prisma'


export const Province = objectType({
    name: ProvinceType.$name,
    description: ProvinceType.$description,
    definition(t) {
        t.field(ProvinceType.id)
        t.field(ProvinceType.name)
        t.field(ProvinceType.cities)
        t.field(ProvinceType.updatedAt)
        t.field(ProvinceType.createdAt)
    }
})
