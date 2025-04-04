import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { AuthenticateUseCase } from "@/use-cases/authenticate"
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error"
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case"
import { makeGetUserProfileUseCase } from "@/use-cases/factories/make-get-user-profile-use-case"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function profile (req: FastifyRequest, reply: FastifyReply) {
    const getUserProfile = makeGetUserProfileUseCase()

    const {user} = await getUserProfile.execute({
        userId: req.user.sub
    })

    return reply.status(200).send({
        user: {
            ...user,
            password_hash: undefined
        }
    })
}