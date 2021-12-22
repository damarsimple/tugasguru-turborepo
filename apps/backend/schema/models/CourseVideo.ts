import { objectType, extendType } from "nexus"
import { CourseVideo as CourseVideoType } from 'nexus-prisma'


export const CourseVideo = objectType({
    name: CourseVideoType.$name,
    description: CourseVideoType.$description,
    definition(t) {
        t.field(CourseVideoType.id)
        t.field(CourseVideoType.name)
        t.field(CourseVideoType.views)
        t.field(CourseVideoType.files)
        t.field(CourseVideoType.filesType)
        t.field(CourseVideoType.updatedAt)
        t.field(CourseVideoType.createdAt)
    }
})


