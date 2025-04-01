import { beforeEach, describe, expect, it, test } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { inMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'
import { Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

let gymsRepository: inMemoryGymsRepository
let sut: CreateGymUseCase

describe("Create Gym Use Case", () => {
    beforeEach(() => {
        gymsRepository = new inMemoryGymsRepository();
        sut = new CreateGymUseCase(gymsRepository)
    })
    it("Should be able to create gym", async () => {


        const { gym } = await sut.execute({
            title: "Javascript Gym",
            description: null,
            phone: null,
            latitude: new Decimal(-23.5835022).toNumber(),
            longitude: new Decimal(-46.5049537).toNumber(),
        })

        expect(gym.id).toEqual(expect.any(String))
    })


})