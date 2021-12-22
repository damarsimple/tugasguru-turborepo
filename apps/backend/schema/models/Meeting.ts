
import { objectType, extendType } from "nexus"
import { Meeting as MeetingType } from 'nexus-prisma'


export const Meeting = objectType({
    name: MeetingType.$name,
    description: MeetingType.$description,
    definition(t) {
        t.field(MeetingType.id)
        t.field(MeetingType.user)
        t.field(MeetingType.uuid)
        t.field(MeetingType.startAt)
        t.field(MeetingType.finishAt)
        t.field(MeetingType.name)
        t.field(MeetingType.classroom)
        t.field(MeetingType.documents)
        t.field(MeetingType.filesTypes)
        t.field(MeetingType.contentText)
        t.field(MeetingType.contentType)
        t.field(MeetingType.contentUrl)
        // t.field(MeetingType.agenda)
        t.field(MeetingType.room)
        t.field(MeetingType.createdAt)
        t.field(MeetingType.updatedAt)
    }
})


export const MeetingQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('meetings', {
            type: Meeting,
            resolve: (_, args, ctx) => {
                return ctx.prisma.meeting.findMany()
            }
        })
    },
})


