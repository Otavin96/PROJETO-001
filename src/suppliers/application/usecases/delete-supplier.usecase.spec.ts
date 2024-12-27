import { SuppliersInMemoryRepository } from '@/suppliers/infrastructure/in-memory/suppliers-in-memory.repository'
import { DeleteSupplierUseCase } from './delete-supplier.usecase'
import { SuppliersRepository } from '../../repositories/suppliers.repository'
import { NotFoundError } from '@/common/domain/erros/not-found-error'
import { SuppliersDataBuilder } from '@/suppliers/infrastructure/testing/helpers/suppliers-data-build'

describe('DeleteSupplierUseCase unit tests', () => {
  let repository: SuppliersInMemoryRepository
  let sut: DeleteSupplierUseCase.UseCase

  beforeEach(() => {
    repository = new SuppliersInMemoryRepository()
    sut = new DeleteSupplierUseCase.UseCase(repository)
  })

  it('should throw error when supplier not found', async () => {
    await expect(sut.execute({ id: 'fake-id' })).rejects.toBeInstanceOf(
      NotFoundError,
    )
  })

  it('Should be able to delete a supplier', async () => {
    const spyDelete = jest.spyOn(repository, 'delete')
    const supplier = await repository.insert(SuppliersDataBuilder({}))
    expect(repository.items.length).toBe(1)

    await sut.execute({ id: supplier.id })
    expect(spyDelete).toHaveBeenCalledTimes(1)
    expect(repository.items.length).toBe(0)
  })
})
