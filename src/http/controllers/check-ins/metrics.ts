import { makeGetUserMetricsUseCase } from "@/use-cases/factories/make-get-user-metric-use-case"
import { FastifyReply, FastifyRequest } from "fastify"

export async function metrics(req: FastifyRequest, reply: FastifyReply) {
    const getUserMetricsUserCase = makeGetUserMetricsUseCase()

    const { checkInsCount } = await getUserMetricsUserCase.execute({
        userId: req.user.sub,
    })

    return reply.status(200).send({
        checkInsCount
    })
}