import { beforeEach, describe, expect, it} from 'vitest'
import { inMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInsRepository: inMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe("Get User Metric Use Case", () => {
    beforeEach(async () => {
        checkInsRepository = new inMemoryCheckInsRepository()
        sut = new GetUserMetricsUseCase(checkInsRepository) // Principal varíavel/entidade (sut)
    })
    it("Should be able to get check-ins count from metrics", async () => {
        await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01'
        })

        await checkInsRepository.create({
            gym_id: 'gym-02',
            user_id: 'user-01'
        })

        const {checkInsCount} = await sut.execute({
            userId: 'user-01'
        })

        expect(checkInsCount).toEqual(2)
    })
})