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


export const ChatQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('chats', {
            type: Chat,
            resolve: (_, args, ctx) => {
                return ctx.prisma.chat.findMany()
            }
        })
    },
})


