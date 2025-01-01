import { SuppliersRepository } from '@/suppliers/repositories/suppliers.repository'
import { CreateSupplierUseCase } from './create-supplier.usecase'
import { SuppliersInMemoryRepository } from '@/suppliers/infrastructure/in-memory/suppliers-in-memory.repository'
import { ConflictError } from '@/common/domain/erros/conflict-error'
import { BadRequestError } from '@/common/domain/erros/bad-request-error'

describe('CreateSupplierUseCase unit tests', () => {
  let sut: CreateSupplierUseCase.UseCase
  let repository: SuppliersRepository

  beforeEach(() => {
    repository = new SuppliersInMemoryRepository()
    sut = new CreateSupplierUseCase.UseCase(repository)
  })

  it('Should create a supplier', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')
    const props = {
      name: 'Diamantec',
      description: 'Fornecedor de Serras e Fresas',
      contact_email: 'fornecedor@teste.com',
      phone: '554988010148',
      status: 'ativo',
    }
    const result = await sut.execute(props)
    expect(result.id).toBeDefined
    expect(result.created_at).toBeDefined
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })

  it('should not possible to register a supplier with the name of another supplier', async () => {
    const props = {
      name: 'Diamantec',
      description: 'Fornecedor de Serras e Fresas',
      contact_email: 'fornecedor@teste.com',
      phone: '554988010148',
      status: 'ativo',
    }

    await sut.execute(props)
    await expect(sut.execute(props)).rejects.toBeInstanceOf(ConflictError)
  })

  it('should throws error when name not provided', async () => {
    const props = {
      name: null,
      description: 'Fornecedor de Serras e Fresas',
      contact_email: 'fornecedor@teste.com',
      phone: '554988010148',
      status: 'ativo',
    }
    await expect(sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  })
})
