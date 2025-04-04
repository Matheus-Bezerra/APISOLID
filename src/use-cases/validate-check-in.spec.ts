import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { inMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

let checkInsRepository: inMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe("Validate Check-in Use Case", () => {
    beforeEach(async () => {
        checkInsRepository = new inMemoryCheckInsRepository()
        sut = new ValidateCheckInUseCase(checkInsRepository) // Principal varíavel/entidade (sut)

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()  
    })

    it("Should be able to validate the check-in", async () => {
        const createdCheckIn = await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01'
        })

        const { checkIn } = await sut.execute({
            checkInId: createdCheckIn.id
        })

        expect(checkIn.validated_at).toEqual(expect.any(Date))
        expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
    })

    it("Should not be able to validate an inexistent check-in", async () => {
        await expect(() => {
            return sut.execute({
                checkInId: 'inexistent-check-in-id'
            });
        }).rejects.toBeInstanceOf(ResourceNotFoundError); // Certifique-se de que o ID está correto
    })

    it('Should not be able to validate the check-in after 20 minutes of its creation', async () => {
        vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

        const createdCheckIn = await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01'
        })

        const twentyOneMinutesInMs = 1000 * 60 * 21

        vi.advanceTimersByTime(twentyOneMinutesInMs)

        expect(() => sut.execute({
            checkInId: createdCheckIn.id
        })) .rejects.toBeInstanceOf(LateCheckInValidationError)
    })
})