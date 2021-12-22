import { objectType, extendType } from "nexus"
import { Notification as NotificationType } from 'nexus-prisma'


export const Notification = objectType({
    name: NotificationType.$name,
    description: NotificationType.$description,
    definition(t) {
        t.field(NotificationType.id)
        t.field(NotificationType.user)
        t.field(NotificationType.pictureUrl)
        t.field(NotificationType.context)
        t.field(NotificationType.contextContent)
        t.field(NotificationType.message)
        t.field(NotificationType.updatedAt)
        t.field(NotificationType.createdAt)
    }
})


export const NotificationQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('notifications', {
            type: Notification,
            resolve: (_, args, ctx) => {
                return ctx.prisma.notification.findMany()
            }
        })
    },
})


