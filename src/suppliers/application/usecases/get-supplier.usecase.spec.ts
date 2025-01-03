import { SuppliersRepository } from '@/suppliers/repositories/suppliers.repository'
import { GetSupplierUseCase } from './get-supplier.usecase'
import { SuppliersInMemoryRepository } from '@/suppliers/infrastructure/in-memory/suppliers-in-memory.repository'
import { NotFoundError } from '@/common/domain/erros/not-found-error'

describe('GetSuppplierUseCase unit tests', () => {
  let sut: GetSupplierUseCase.UseCase
  let repository: SuppliersRepository

  beforeEach(() => {
    repository = new SuppliersInMemoryRepository()
    sut = new GetSupplierUseCase.UseCase(repository)
  })

  it('Should be able to get a supplier', async () => {
    const spyFindById = jest.spyOn(repository, 'findById')
    const props = {
      name: 'Diamantec',
      description: 'Fornecedor de Serras e Fresas',
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
