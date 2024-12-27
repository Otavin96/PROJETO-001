import { SuppliersRepository } from '@/suppliers/repositories/suppliers.repository'
import { UpdateSupplierUseCase } from './update-supplier.usecase'
import { SuppliersInMemoryRepository } from '@/suppliers/infrastructure/in-memory/suppliers-in-memory.repository'
import { NotFoundError } from '@/common/domain/erros/not-found-error'

describe('UpdateSupplierUseCase unit tests', () => {
  let sut: UpdateSupplierUseCase.UseCase
  let repository: SuppliersRepository

  beforeEach(() => {
    repository = new SuppliersInMemoryRepository()
    sut = new UpdateSupplierUseCase.UseCase(repository)
  })

  it('Should throw error when supplier not found', async () => {
    await expect(sut.execute({ id: 'fake_id' })).rejects.toBeInstanceOf(
      NotFoundError,
    )
  })

  it('Should be able to update a supplier', async () => {
    const spyUpdate = jest.spyOn(repository, 'update')
    const props = {
      name: 'Supplier 1',
      description: 'Testando',
    }
    const model = repository.create(props)
    await repository.insert(model)

    const newData = {
      id: model.id,
      name: 'new name',
      description: 'Testando',
    }

    const result = await sut.execute(newData)
    expect(result.name).toEqual(newData.name)
    expect(result.description).toEqual(newData.description)
    expect(spyUpdate).toHaveBeenCalledTimes(1)
  })
})
