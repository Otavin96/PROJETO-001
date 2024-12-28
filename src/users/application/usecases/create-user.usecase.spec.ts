import 'reflect-metadata'
import { UsersRepository } from '@/users/repositories/users.repository'
import { UsersInMemoryRepository } from '@/users/infrastructure/in-memory/repositories/users-in-memory.repository'
import { ConflictError } from '@/common/domain/erros/conflict-error'
import { BadRequestError } from '@/common/domain/erros/bad-request-error'
import { CreateUsersUseCase } from './create-user.usecase'

describe('CreateUserUseCase', () => {
  let sut: CreateUsersUseCase.UseCase
  let repository: UsersRepository

  beforeEach(() => {
    repository = new UsersInMemoryRepository()
    sut = new CreateUsersUseCase.UseCase(repository)
  })

  it('Should create a user', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')
    const props = {
      name: 'User 1',
      email: 'user@teste.com',
      password: '123456',
    }
    const result = await sut.execute(props)
    expect(result.id).toBeDefined
    expect(result.created_at).toBeDefined
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })

  it('should not possible to register a user with the name of another user', async () => {
    const props = {
      name: 'User 1',
      email: 'user@teste.com',
      password: '123456',
    }

    await sut.execute(props)
    await expect(sut.execute(props)).rejects.toBeInstanceOf(ConflictError)
  })

  it('should throws error when name not provided', async () => {
    const props = {
      name: null,
      email: 'user@teste.com',
      password: '123456',
    }
    await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })

  it('should throws error when email not provided', async () => {
    const props = {
      name: 'User 1',
      email: null,
      password: '123456',
    }
    await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })

  it('should throws error when password not provided', async () => {
    const props = {
      name: 'User 1',
      email: 'user@teste.com',
      password: null,
    }
    await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })
})
