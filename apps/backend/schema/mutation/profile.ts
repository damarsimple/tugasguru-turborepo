import { FileUpload } from "graphql-upload";
import { arg, extendType, intArg, nonNull, stringArg } from "nexus";
import { saveFile } from "../../api/file";
import { removeEmpty } from "../../helpers/formatter";
import { User } from "../models";


export const ProfileMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field({
            name: 'changeProfile',
            type: User,
            authorize: (_, { id }, { user, isAdmin }) => isAdmin || id == user?.id,
            args: {
                id: nonNull(intArg()),
                name: stringArg(),
                password: stringArg(),
                isBimbelActive: stringArg(),
                coverId: stringArg(),
                identityNumber: stringArg(),
                classtypeId: intArg(),
                provinceId: intArg(),
                cityId: intArg(),

                cover: arg({ type: "Upload" }),
            },
            async resolve(root, { id, cover, ...args }, ctx) {

                if (cover) {
                    const file = await saveFile(await cover as FileUpload, ctx, "PROFILE", ctx?.user?.id, "User")
                }

                return await ctx.prisma.user.update({
                    where: {
                        id
                    },
                    data: {
                        ...removeEmpty(args)
                    }
                })
            }
        })

    },
})


