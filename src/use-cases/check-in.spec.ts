import {beforeEach, describe, expect, it, test} from 'vitest'
import { hash } from 'bcryptjs'
import { inMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { inMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './checkin'

let checkInsRepository: inMemoryCheckInsRepository
let sut: CheckInUseCase

describe("Check-in Use Case", () => {
    beforeEach(() => {
        checkInsRepository = new inMemoryCheckInsRepository()
        sut = new CheckInUseCase(checkInsRepository) // Principal varíavel/entidade (sut)
    })

    it("Should be able to check in", async () => {
        const {checkIn} = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01'
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })
})