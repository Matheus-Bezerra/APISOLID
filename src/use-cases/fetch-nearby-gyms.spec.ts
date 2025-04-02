import { beforeEach, describe, expect, it } from 'vitest'
import { inMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymUseCase } from './search-gyms'
import { Decimal } from '@prisma/client/runtime/library'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: inMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe("Fetch Nearby Gyms Use Case", () => {
    beforeEach(async () => {
        gymsRepository = new inMemoryGymsRepository()
        sut = new FetchNearbyGymsUseCase(gymsRepository) // Principal varíavel/entidade (sut)
    })
    it("Should be able to fetch nearby gyms", async () => {
        await gymsRepository.create({
            title: "Near Gym",
            description: null,
            phone: null,
            latitude: new Decimal(-23.5835022).toNumber(),
            longitude: new Decimal(-46.5049537).toNumber(),
        })

        await gymsRepository.create({
            title: "Far Gym",
            description: null,
            phone: null,
            latitude: new Decimal(-27.5835022).toNumber(),
            longitude: new Decimal(-36.5049537).toNumber(),
        })

        const {gyms} = await sut.execute({
            userLatitude: new Decimal(-23.5835022).toNumber(),
            userLongitude: new Decimal(-46.5049537).toNumber(),
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([expect.objectContaining({title: 'Near Gym'})])
    })
})