import { prisma } from "../api/context"

async function main() {
    await prisma.classroom.findFirst({
        include: {
            students: true,
        }


    })
}

main()