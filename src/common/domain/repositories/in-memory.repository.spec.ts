import { randomUUID } from 'node:crypto'
import { InMemoryRepository } from './in-memory.repository'

type StubModelProps = {
  id: string
  description: string
  type: string
  quantity: number
  stockMax: number
  stockMin: number
  created_at: Date
  updated_at: Date
}

class StubInMemoryRepository extends InMemoryRepository<StubModelProps> {
  constructor() {
    super()
    this.sortableFields['description']
  }
  
  protected async applyFilter(items: StubModelProps[], filter: string | null): Promise<StubModelProps[]> {
    if(!filter) return items
    return items.filter(item => item.description.toLowerCase().includes(filter.toLowerCase()),)
  }
}

describe('InMemoryRepository unit test', () => {
  let sut: StubInMemoryRepository
  let model: StubModelProps
  let props: any
  let created_at: Date
  let updated_at: Date

  beforeEach(() => {
    sut = new StubInMemoryRepository()
    created_at: new Date()
    updated_at: new Date()
    props = {
      description: 'test description',
      type: 'test type',
      quantity: 10,
      stockMax: 20,
      stockMin: 5,
    }
    model = {
      id: randomUUID(),
      created_at,
      updated_at,
      ...props,
    }
  })

  describe('create', () => {
    it('should create a model', () => {
      const result = sut.create(props)
      expect(result.description).toStrictEqual('test description')
    })
  })

  describe('insert', () => {
    it('should inserts a new model', async () => {
      const result = await sut.insert(model)
      expect(result).toStrictEqual(sut.items[0])
    })
  })
})
