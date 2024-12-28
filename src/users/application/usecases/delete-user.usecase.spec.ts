import 'reflect-metadata'
import { UsersInMemoryRepository } from '@/users/infrastructure/in-memory/repositories/users-in-memory.repository'
import { DeleteUserUseCase } from './delete-user.usecase'
import { NotFoundError } from '@/common/domain/erros/not-found-error'
import { UsersDataBuilder } from '@/users/infrastructure/testing/helpers/users-data-build'

describe('DeleteUserUseCase unit tests', () => {
  let repository: UsersInMemoryRepository
  let sut: DeleteUserUseCase.UseCase

  beforeEach(() => {
    repository = new UsersInMemoryRepository()
    sut = new DeleteUserUseCase.UseCase(repository)
  })

  it('should throw error when user not found', async () => {
    await expect(sut.execute({ id: 'fake-id' })).rejects.toBeInstanceOf(
      NotFoundError,
    )
  })

  it('Should be able to delete a user', async () => {
    const spyDelete = jest.spyOn(repository, 'delete')
    const user = await repository.insert(UsersDataBuilder({}))
    expect(repository.items.length).toBe(1)

    await sut.execute({ id: user.id })
    expect(spyDelete).toHaveBeenCalledTimes(1)
    expect(repository.items.length).toBe(0)
  })
})
