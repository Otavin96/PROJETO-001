import { SuppliersInMemoryRepository } from '@/suppliers/infrastructure/in-memory/suppliers-in-memory.repository'
import { SearchSupplierUseCase } from './search-supplier.usecase'
import { SuppliersDataBuilder } from '@/suppliers/infrastructure/testing/helpers/suppliers-data-build'

describe('SearchSupplierUseCase unit tests', () => {
  let sut: SearchSupplierUseCase.UseCase
  let repository: SuppliersInMemoryRepository

  beforeEach(() => {
    repository = new SuppliersInMemoryRepository()
    sut = new SearchSupplierUseCase.UseCase(repository)
  })

  it('should return the products ordered by created_at', async () => {
    const created_at = new Date()
    const items = [
      { ...SuppliersDataBuilder({}) },
      {
        ...SuppliersDataBuilder({
          created_at: new Date(created_at.getTime() + 100),
        }),
      },

      {
        ...SuppliersDataBuilder({
          created_at: new Date(created_at.getTime() + 200),
        }),
      },
    ]

    repository.items = items

    const result = await sut.execute({})

    expect(result).toStrictEqual({
      items: [...items].reverse(),
      total: 3,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    })
  })

  it('should return output using pagination, sort and filter', async () => {
    const items = [
      { ...SuppliersDataBuilder({ name: 'a' }) },
      { ...SuppliersDataBuilder({ name: 'AA' }) },
      { ...SuppliersDataBuilder({ name: 'Aa' }) },
      { ...SuppliersDataBuilder({ name: 'b' }) },
      { ...SuppliersDataBuilder({ name: 'c' }) },
    ]
    repository.items = items

    let output = await sut.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'asc',
      filter: 'a',
    })

    expect(output).toStrictEqual({
      items: [items[1], items[2]],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    })

    output = await sut.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc',
      filter: 'a',
    })

    expect(output).toStrictEqual({
      items: [items[0], items[2]],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    })
  })
})
