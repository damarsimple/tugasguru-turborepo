
import { objectType, extendType } from "nexus"
import { Tutoring as TutoringType } from 'nexus-prisma'


export const Tutoring = objectType({
    name: TutoringType.$name,
    description: TutoringType.$description,
    definition(t) {
        t.field(TutoringType.id)
        t.field(TutoringType.user)
        t.field(TutoringType.teacher)
        // t.field(TutoringType.agenda)
        t.field(TutoringType.status)
        t.field(TutoringType.approved)
        t.field(TutoringType.startAt)
        t.field(TutoringType.finishAt)
        t.field(TutoringType.rate)
        t.field(TutoringType.room)
        t.field(TutoringType.address)
        t.field(TutoringType.notes)
        t.field(TutoringType.rejectedReason)
        // t.field(TutoringType.geolocation)
        t.field(TutoringType.room)
    }
})



