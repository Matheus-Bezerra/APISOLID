import { makeFetchUserCheckInsHistoryUseCase } from "@/use-cases/factories/make-fetch-user-check-ins-history-use-case"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function history(req: FastifyRequest, reply: FastifyReply) {
    const checkInhistoryQuerySchema = z.object({
        page: z.coerce.number().min(1).default(1)
    })

    const { page } = checkInhistoryQuerySchema.parse(req.query)

    const fetchUserCheeckInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase()

    const { checkIns } = await fetchUserCheeckInsHistoryUseCase.execute({
        userId: req.user.sub,
        page
    })

    return reply.status(200).send({
        checkIns
    })
}