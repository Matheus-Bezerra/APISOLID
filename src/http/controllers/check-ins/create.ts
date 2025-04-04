import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-use-case"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function create(req: FastifyRequest, reply: FastifyReply) {
    const createCheckInParamsSchema = z.object({
        gymId: z.string().uuid()
    })

    const createCheckInBodySchema = z.object({
        latitude: z.coerce.number().refine(value => {
            return Math.abs(value) <= 90
        }),
        longitude: z.coerce.number().refine(value => {
            return Math.abs(value) <= 180
        }),
    })

    const { latitude, longitude } = createCheckInBodySchema.parse(req.body)
    const { gymId } = createCheckInParamsSchema.parse(req.params)

    const createUseCase = makeCheckInUseCase()

    await createUseCase.execute({
        gymId,
        userId: req.user.sub,
        userLatitude: latitude,
        userLongitude: longitude
    })

    return reply.status(201).send()
}