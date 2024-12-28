import 'reflect-metadata'
import { GetUsersUseCase } from './get-user.usecase'
import { UsersInMemoryRepository } from '../../infrastructure/in-memory/repositories/users-in-memory.repository'
import { NotFoundError } from '@/common/domain/erros/not-found-error'

describe('GetUserUseCase', () => {
  let sut: GetUsersUseCase.UseCase
  let repository: UsersInMemoryRepository

  beforeEach(() => {
    repository = new UsersInMemoryRepository()
    sut = new GetUsersUseCase.UseCase(repository)
  })

  it('Should be able to get a user', async () => {
    const spyFindById = jest.spyOn(repository, 'findById')
    const props = {
      name: 'User 1',
      email: 'user@teste.com',
      password: '123456',
    }
    const model = repository.create(props)
    await repository.insert(model)

    const result = await sut.execute({ id: model.id })
    expect(result).toMatchObject(model)
    expect(spyFindById).toHaveBeenCalledTimes(1)
  })

  it('Should throw error when supplier not found', async () => {
    await expect(sut.execute({ id: 'id_fake' })).rejects.toBeInstanceOf(
      NotFoundError,
    )
  })
})
