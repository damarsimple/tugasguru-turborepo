
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
        t.field(MeetingType.contentId)
        // t.field(MeetingType.agenda)
        t.field(MeetingType.room)
        t.field(MeetingType.createdAt)
        t.field(MeetingType.updatedAt)
    }
})



