import {afterEach, beforeEach, describe, expect, it, test, vi} from 'vitest'
import { inMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './checkin'
import { inMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: inMemoryCheckInsRepository
let gymsRepository: inMemoryGymsRepository
let sut: CheckInUseCase

describe("Check-in Use Case", () => {
    beforeEach(() => {
        checkInsRepository = new inMemoryCheckInsRepository()
        gymsRepository = new inMemoryGymsRepository()
        sut = new CheckInUseCase(checkInsRepository, gymsRepository) // Principal varíavel/entidade (sut)

        gymsRepository.items.push({
            id: 'gym-01',
            title: 'Javascript GYM',
            description: '',
            latitude: new Decimal(0),
            longitude: new Decimal(0),
            phone: ''
        })

        vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()  
    })

    it("Should be able to check in", async () => {
        

        const {checkIn} = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it("Should not be to check in twice in the same day", async () => {
        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0
        })


        await expect(() =>  sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0
        })).rejects.toBeInstanceOf(Error)

    })

    it("Should not be to check in twice but in different days", async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0
        })

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

        const {checkIn} = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0
        })

        expect(checkIn.id).toEqual(expect.any(String))        
    })

    it("Should not be able to check in on distant gym", async () => {
        gymsRepository.items.push({
            id: 'gym-02',
            title: 'Javascript GYM',
            description: '',
            latitude: new Decimal(-23.5835022),
            longitude: new Decimal(-46.5049537),
            phone: ''
        })

        await expect(() => sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -23.5835022,
            userLongitude: -46.5049537
        })).rejects.toBeInstanceOf(Error)

    })
})