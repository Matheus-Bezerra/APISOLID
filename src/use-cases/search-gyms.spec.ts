import { beforeEach, describe, expect, it } from 'vitest'
import { inMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymUseCase } from './search-gyms'
import { Decimal } from '@prisma/client/runtime/library'

let gymsRepository: inMemoryGymsRepository
let sut: SearchGymUseCase

describe("Search GymsUse Case", () => {
    beforeEach(async () => {
        gymsRepository = new inMemoryGymsRepository()
        sut = new SearchGymUseCase(gymsRepository) // Principal varíavel/entidade (sut)
    })
    it("Should be able to search for gyms", async () => {
        await gymsRepository.create({
            title: "Javascript Gym",
            description: null,
            phone: null,
            latitude: new Decimal(-23.5835022).toNumber(),
            longitude: new Decimal(-46.5049537).toNumber(),
        })

        await gymsRepository.create({
            title: "Typescript Gym",
            description: null,
            phone: null,
            latitude: new Decimal(-23.5835022).toNumber(),
            longitude: new Decimal(-46.5049537).toNumber(),
        })

        const {gyms} = await sut.execute({
            query: 'Javascript',
            page: 1
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([expect.objectContaining({title: 'Javascript Gym'})])
    })

    it("Should be able to fetch paginated gyms search", async () => {
        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                title: `Javascript Gym - ${i}`,
                description: null,
                phone: null,
                latitude: new Decimal(-23.5835022).toNumber(),
                longitude: new Decimal(-46.5049537).toNumber(),
            })
        }

        const { gyms } = await sut.execute({
            query: 'Javascript',
            page: 2
        })

        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Javascript Gym - 21' }),
            expect.objectContaining({ title: 'Javascript Gym - 22' })
        ])
    })
})