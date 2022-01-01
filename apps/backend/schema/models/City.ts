import { objectType, extendType, intArg } from "nexus";
import { City as CityType } from "nexus-prisma";

export const City = objectType({
  name: CityType.$name,
  description: CityType.$description,
  definition(t) {
    t.field(CityType.id);
    t.field(CityType.name);
    t.field(CityType.province);
    t.field(CityType.updatedAt);
    t.field(CityType.createdAt);
  },
});

export const CityQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field({
      type: City,
      args: {
        provinceId: intArg(),
      },
      name: "cities",
      resolve: async (_, { provinceId }, { prisma }) => {
        if (!provinceId) return [];

        return await prisma.city.findMany({
          where: {
            provinceId,
          },
        });
      },
    });
  },
});
