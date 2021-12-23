import { objectType, extendType } from "nexus"
import { Room as RoomType } from 'nexus-prisma'


export const Room = objectType({
    name: RoomType.$name,
    description: RoomType.$description,
    definition(t) {
        t.field(RoomType.id)
        t.field(RoomType.user)
        t.field(RoomType.updatedAt)
        t.field(RoomType.createdAt)
    }
})


