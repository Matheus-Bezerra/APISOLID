import { beforeEach, describe, expect, it} from 'vitest'
import { inMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-inss-history'

let checkInsRepository: inMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryUseCase

describe("Fetch Check-in History Use Case", () => {
    beforeEach(async () => {
        checkInsRepository = new inMemoryCheckInsRepository()
        sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository) // Principal varíavel/entidade (sut)
    })
    it("Should be able to fetch check-in history", async () => {
        await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01'
        })

        await checkInsRepository.create({
            gym_id: 'gym-02',
            user_id: 'user-01'
        })

        const {checkIns} = await sut.execute({
            userId: 'user-01',
            page: 1
        })

        expect(checkIns).toHaveLength(2)
        expect(checkIns).toEqual([
            expect.objectContaining({gym_id: 'gym-01'}),
            expect.objectContaining({gym_id: 'gym-02'})
        ])
    })

    it("Should be able to fetch paginated check-in history", async () => {
        for (let i = 1; i <= 22; i++) {
            await checkInsRepository.create({
                gym_id: `gym-${i}`,
                user_id: 'user-01'
            })
        }

        const {checkIns} = await sut.execute({
            userId: 'user-01',
            page: 2
        })

        expect(checkIns).toHaveLength(2)
        expect(checkIns).toEqual([
            expect.objectContaining({gym_id: 'gym-21'}),
            expect.objectContaining({gym_id: 'gym-22'})
        ])
    })
})