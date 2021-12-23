import { prisma } from "../api/context"
import daerah from "./daerah.json"
import schools from "./schools.json"
import pino from "pino";
import { genSalt, hash } from "bcrypt";
import { Roles, SubjectType } from "@prisma/client";
import { take } from "lodash"

const dest = pino.destination({
    sync: false,

})
const logger = pino(dest)


async function main() {


    const start = Date.now();

    logger.info("creating provinces")

    for (const { provinsi, kota } of daerah) {

        const province = await prisma.province.create({
            data: {
                name: provinsi,
            }
        })

        await prisma.city.createMany({
            data: kota.map((kota) => ({
                name: kota,
                provinceId: province.id,
            }))

        })

        if (kota.includes("Kab. Berau")) {

            const city = await prisma.city.findFirst({
                where: {
                    name: "Kab. Berau"
                }
            })

            if (city) {
                logger.info(`Kab Berau detected creating school`)

                for (const sch of schools) {
                    const school = await prisma.school.create({
                        data: {
                            name: sch.name,
                            address: sch.address,
                            npsn: sch.npsn,
                            cityId: city.id,
                            provinceId: province.id,
                        }
                    });

                    logger.info(`${school.name} created`)

                }
                logger.info(`finished creating school`)
            }


        }

        logger.info(`${provinsi} created`)
    }

    logger.info("creating subjects")

    for (const type in subjectMap) {
        const subjects = subjectMap[type]
        for (const subject of subjects) {

            await prisma.subject.create({
                data: {
                    name: subject,
                    abbreviation: subject.split(" ").map((word) => word[0].toUpperCase()).join(""),
                    //@ts-ignore
                    type,
                }
            })

            logger.info(`${subject} created`)

        }

    }

    logger.info("creating classtypes");


    await prisma.classtype.createMany({
        data: [...new Array(12)].map((_, i) => ({
            level: i
        }))
    })

    logger.info("creating examtypes");


    await prisma.examtype.createMany({
        data: ["Latihan", "Ulangan Harian", "PTS", "PAS"].map((e) => ({
            name: e
        }))
    })


    logger.info("creating users");

    const salt = await genSalt();

    const admin = await prisma.user.create({
        data: {
            username: "admin",
            email: "admin@admin.com",
            address: "24 Jump Street",
            phone: "081234567890",
            password: await hash("admin", salt),
            roles: Roles.ADMIN,
            name: "Admin",
            identityNumber: "1234567890",
            cityId: 1,
            provinceId: 1
        }
    })

    const teacher = await prisma.user.create({
        data: {
            username: "teacher",
            email: "teacher@teacher.com",
            address: "24 Jump Street",
            phone: "0812345678913",
            password: await hash("teacher", salt),
            roles: Roles.TEACHER,
            name: "teacher",
            cityId: 1,
            provinceId: 1,
            identityNumber: "1234567890",
        }
    })

    const teacherBimbel = await prisma.user.create({
        data: {
            username: "teacherBimbel",
            email: "teacherBimbel@teacherBimbel.com",
            address: "24 Jump Street",
            phone: "0812345678911",
            password: await hash("teacherBimbel", salt),
            roles: Roles.TEACHER,
            name: "teacherBimbel",
            cityId: 1,
            provinceId: 1,
            isBimbel: true,
            identityNumber: "1234567890",
        }
    })

    const parent = await prisma.user.create({
        data: {
            username: "parent",
            email: "parent@parent.com",
            address: "24 Jump Street",
            phone: "0812345678914",
            password: await hash("parent", salt),
            roles: Roles.PARENT,
            name: "parent",
            cityId: 1,
            provinceId: 1
        }
    })


    const student = await prisma.user.create({
        data: {
            username: "student",
            email: "student@student.com",
            address: "24 Jump Street",
            phone: "0812345678912",
            password: await hash("student", salt),
            roles: Roles.STUDENT,
            name: "student",
            nisn: "12345678910",
            cityId: 1,
            provinceId: 1,
            schoolId: 1,
            classtypeId: 1,
            parentId: parent.id
        }
    })



    logger.info("creating classrooms");

    await prisma.classroom.createMany({
        data: [...new Array(3)].map((_, i) => ({
            name: `${i + 1}A`,
            classtypeId: i + 1,
            schoolId: 1,
            userId: teacher.id,
        }))
    })

    const classroom = await prisma.classroom.update({
        where: {
            id: 1
        },
        data: {
            students: {
                connect: [{
                    id: student.id,
                }],
            }
        }
    });



    logger.info("creating questions");

    const questions = await prisma.question.createMany({
        data: [...new Array(100)].map((_, i) => ({
            content: `${i + 1}A`,
            classtypeId: 1,
            subjectId: 1,
            userId: teacher.id,
            answers: {
                set: [...new Array(10)].fill("Test 10"),
            }
        }))
    })

    logger.info("creating quizes");

    await prisma.question.createMany({
        data: [...new Array(100)].map((_, i) => ({
            content: `${i + 1}A`,
            classtypeId: 1,
            subjectId: 1,
            userId: teacher.id,
            answers: {
                set: [...new Array(10)].fill("Test 10"),
            }
        }))
    })

    logger.info('done seeding took ' + (Date.now() - start) + 'ms')
}
main()



const subjectMap: Record<string, string[]> = {
    [SubjectType.GENERAL]: [
        "Pendidikan Agama",
        "Pendidikan Kewarganegaraan",
        "Bahasa Indonesia",
        "Matematika",
        "Ilmu Pengetahuan Alam",
        "Ilmu Pengetahuan Sosial",
        "Bahasa Inggris",
        "Seni Budaya",
        "Pendidikan Jasmani",
        "Prakarya",
    ],
    [SubjectType.LOCALCONTENT]: [
        "Bahasa Sunda",
        "Bahasa Jawa",
    ],
    [SubjectType.SPECIALDEVELOPMENT]: [
        "Public Speaking",
    ],
}
