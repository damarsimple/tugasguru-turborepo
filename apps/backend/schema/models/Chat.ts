import { objectType, extendType } from "nexus"
import { Chat as ChatType } from 'nexus-prisma'


export const Chat = objectType({
    name: ChatType.$name,
    description: ChatType.$description,
    definition(t) {
        t.field(ChatType.id)
        t.field(ChatType.from)
        t.field(ChatType.content)
        t.field(ChatType.type)
        t.field(ChatType.room)
        t.field(ChatType.updatedAt)
        t.field(ChatType.createdAt)
    }
})


