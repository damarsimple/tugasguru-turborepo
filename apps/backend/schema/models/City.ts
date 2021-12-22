import { objectType, extendType } from "nexus"
import { City as CityType } from 'nexus-prisma'


export const City = objectType({
    name: CityType.$name,
    description: CityType.$description,
    definition(t) {
        t.field(CityType.id)
        t.field(CityType.name)
        t.field(CityType.province)
        t.field(CityType.districts)
        t.field(CityType.updatedAt)
        t.field(CityType.createdAt)
    }
})


export const CityQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('cities', {
            type: City,
            resolve: (_, args, ctx) => {
                return ctx.prisma.city.findMany()
            }
        })
    },
})


