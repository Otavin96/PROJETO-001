import 'reflect-metadata'
import { UsersInMemoryRepository } from '@/users/infrastructure/in-memory/repositories/users-in-memory.repository'
import { UsersRepository } from '@/users/repositories/users.repository'
import { UpdateUserUseCase } from './update-user.usecase'
import { NotFoundError } from '@/common/domain/erros/not-found-error'

describe('UpdateUserUseCase', () => {
  let repository: UsersInMemoryRepository
  let sut: UpdateUserUseCase.UseCase

  beforeEach(() => {
    repository = new UsersInMemoryRepository()
    sut = new UpdateUserUseCase.UseCase(repository)
  })

  it('Should throw error when user not found', async () => {
    await expect(sut.execute({ id: 'fake_id' })).rejects.toBeInstanceOf(
      NotFoundError,
    )
  })

  it('Should be able to update a user', async () => {
    const spyUpdate = jest.spyOn(repository, 'update')
    const props = {
      name: 'User 1',
      email: 'user@teste.com',
      password: '123456',
    }
    const model = repository.create(props)
    await repository.insert(model)

    const newData = {
      id: model.id,
      name: 'New User',
      email: 'user@teste.com',
      password: '123456',
    }

    const result = await sut.execute(newData)
    expect(result.name).toEqual(newData.name)
    expect(result.email).toEqual(newData.email)
    expect(spyUpdate).toHaveBeenCalledTimes(1)
  })
})
