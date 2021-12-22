import { prisma } from "../api/context"

export async function logRequestDB(operationName: string, query: string, variables: string, elapsed: number) {

    await prisma.metric.create({
        data: {
            operationName,
            query,
            elapsed,
            variables,
        }
    })

}