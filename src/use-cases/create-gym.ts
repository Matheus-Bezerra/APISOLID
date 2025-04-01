import { UsersRepository } from "@/repositories/users-repository"
import { hash } from "bcryptjs"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error"
import { Gym } from "@prisma/client"
import { GymsRepository } from "@/repositories/gyms-repository"

interface CreateGymCaseRequest {
    title: string
    description: string | null
    phone: string | null
    latitude: number
    longitude: number
}

interface CreateGymCaseResponse {
    gym: Gym
}

// SOLID

// D - Dependency inversion Principle - Ao invbés de instanciar dependências, ela vai receber como parâmetros

export class CreateGymUseCase {
    constructor(private gymsRepository: GymsRepository) { }

    async execute({ title, description, latitude, longitude, phone }: CreateGymCaseRequest): Promise<CreateGymCaseResponse> {
        const gym = await this.gymsRepository.create({
            title,
            description,
            phone,
            latitude,
            longitude
        })

        return { gym }
    }
}