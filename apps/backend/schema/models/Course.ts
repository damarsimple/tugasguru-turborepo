import { objectType, extendType } from "nexus"
import { Course as CourseType, AccessType } from 'nexus-prisma'


export const Course = objectType({
    name: CourseType.$name,
    description: CourseType.$description,
    definition(t) {
        t.field(CourseType.id)
        t.field(CourseType.name)
        t.field(CourseType.user)
        t.field(CourseType.views)
        t.field(CourseType.access)
        t.field(CourseType.description)
        t.field(CourseType.updatedAt)
        t.field(CourseType.createdAt)

        t.field(CourseType.subjects)
        t.field(CourseType.classtypes)
        t.field(CourseType.coursevideos)
    }
})
