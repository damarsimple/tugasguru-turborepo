import { extendType, intArg, nonNull, stringArg } from "nexus";
import { Meeting } from "../models";


export const MeetingMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nullable.field("createMeeting", {
            type: Meeting,
            authorize: (_, __, ctx) => ctx.isLogged,
            args: {
                name: nonNull(stringArg()),
                classroomId: intArg(),
            },
            resolve: async (_, { name, classroomId }, ctx) => {
                if (ctx.user?.id) {
                    const meeting = await ctx.prisma.meeting.create({
                        data: {
                            // ...args,
                            userId: ctx.user.id,
                            name,
                            classroomId
                        }
                    });
                    return meeting;
                }
                return null

            }
        })
    }
})