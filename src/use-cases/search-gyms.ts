import { Gym } from "@prisma/client"
import { GymsRepository } from "@/repositories/gyms-repository"

interface SearchGymUseCaseRequest {
    query: string
    page: number
}

interface SearchGymUseCaseResponse {
    gyms: Gym[]
}

// SOLID

// D - Dependency inversion Principle - Ao invbés de instanciar dependências, ela vai receber como parâmetros

export class SearchGymUseCase {
    constructor(private gymsRepository: GymsRepository) { }

    async execute({ query, page }: SearchGymUseCaseRequest): Promise<SearchGymUseCaseResponse> {
        const gyms = await this.gymsRepository.searchMany(query, page)

        return { gyms }
    }
}