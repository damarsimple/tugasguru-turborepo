import { extendType, objectType } from 'nexus';
import { Classroom as ClassroomType } from 'nexus-prisma'

export const Classroom = objectType({
    name: ClassroomType.$name,
    description: ClassroomType.$description,
    definition(t) {
        t.field(ClassroomType.id);
        t.field(ClassroomType.userId);
        t.field(ClassroomType.name);
        t.field(ClassroomType.user);
        t.field(ClassroomType.updatedAt)
        t.field(ClassroomType.createdAt)
    }
})

export const ClassroomQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('classrooms', {
            type: Classroom,
            resolve: (_, args, ctx) => {
                return ctx.prisma.classroom.findMany({
                    take: 10,
                    cursor: {
                        id: 10
                    }

                })
            }
        })
    },
})
