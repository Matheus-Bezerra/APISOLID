import { Gym } from "@prisma/client"
import { GymsRepository } from "@/repositories/gyms-repository"

interface FetchNearbyGymsUseCaseRequest {
    userLatitude: number
    userLongitude: number
}

interface FetchNearbyGymsUseCaseResponse {
    gyms: Gym[]
}

// SOLID

// D - Dependency inversion Principle - Ao invbés de instanciar dependências, ela vai receber como parâmetros

export class FetchNearbyGymsUseCase {
    constructor(private gymsRepository: GymsRepository) { }

    async execute({ userLatitude, userLongitude }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
        const gyms = await this.gymsRepository.findManyNearby({ latitde: userLatitude, longitude: userLongitude })

        return { gyms }
    }
}