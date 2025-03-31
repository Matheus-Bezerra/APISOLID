import {beforeEach, describe, expect, it, test} from 'vitest'
import { compare, hash } from 'bcryptjs'
import { inMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { RegisterUseCase } from './register'

let usersRepository: inMemoryUsersRepository
let sut: AuthenticateUseCase

describe("Authenticate Use Case", () => {
    beforeEach(() => {
        usersRepository = new inMemoryUsersRepository()
        sut = new AuthenticateUseCase(usersRepository) // Principal varíavel/entidade (sut)
    })

    it("Should be able to authenticate", async () => {
        
        await usersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash('123456', 6)
        })

        const {user} = await sut.execute({
            email: "johndoe@example.com",
            password: "123456"
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it("Should not be able to authenticate with wrong email", async () => {

        await expect(() => sut.execute({
            email: "johndoe@example.com",
            password: "123456"
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
        
    })

    it("Should not be able to authenticate with wrong password", async () => {

        await usersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash('123456', 6)
        })

        expect(() => sut.execute({
            email: "johndoe@example.com",
            password: "123123"
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
        
    })
})