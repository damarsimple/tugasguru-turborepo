import { objectType, extendType } from "nexus"
import { Post as PostType } from 'nexus-prisma'


export const Post = objectType({
    name: PostType.$name,
    description: PostType.$description,
    definition(t) {
        t.field(PostType.id)
        t.field(PostType.title)
        t.field(PostType.user)
        t.field(PostType.pictureId)
        t.field(PostType.content)
        t.field(PostType.type)
        t.field(PostType.updatedAt)
        t.field(PostType.createdAt)

        t.field(PostType.school)
    }
})
