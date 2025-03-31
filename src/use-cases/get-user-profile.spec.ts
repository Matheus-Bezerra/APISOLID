import {beforeEach, describe, expect, it, test} from 'vitest'
import { hash } from 'bcryptjs'
import { inMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: inMemoryUsersRepository
let sut: GetUserProfileUseCase

describe("Authenticate Use Case", () => {
    beforeEach(() => {
        usersRepository = new inMemoryUsersRepository()
        sut = new GetUserProfileUseCase(usersRepository) // Principal varíavel/entidade (sut)
    })

    it("Should be able to get user profile", async () => {
        
        const createdUser = await usersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash('123456', 6)
        })

        const {user} = await sut.execute({
            userId: createdUser.id
        })

        expect(user.id).toEqual(expect.any(String))
        expect(user.name).toEqual('John Doe')
    })

    it("Should not be able to get user profile with wrong id", async () => {

        await expect(() => sut.execute({
            userId: 'non-existing-id'
        })).rejects.toBeInstanceOf(ResourceNotFoundError)
        
    })
})