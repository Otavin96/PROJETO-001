import { randomUUID } from 'node:crypto'
import { InMemoryRepository } from './in-memory.repository'
import { NotFoundError } from '../erros/not-found-error'

type StubModelProps = {
  id: string
  description: string
  type: string
  created_at: Date
  updated_at: Date
}

class StubInMemoryRepository extends InMemoryRepository<StubModelProps> {
  constructor() {
    super()
    this.sortableFields['description']
  }

  protected async applyFilter(
    items: StubModelProps[],
    filter: string | null,
  ): Promise<StubModelProps[]> {
    if (!filter) return items
    return items.filter(item =>
      item.description.toLowerCase().includes(filter.toLowerCase()),
    )
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

  describe('findById', () => {
    it('Should throw erro when id not found', async () => {
      await expect(sut.findById('fake_id')).rejects.toThrow(
        new NotFoundError('Model not found using ID fake_id'),
      )

      const id = randomUUID()

      await expect(sut.findById(id)).rejects.toThrow(
        new NotFoundError(`Model not found using ID ${id}`),
      )
    })

    it('should find a model by id', async () => {
      const data = await sut.insert(model)
      const result = await sut.findById(data.id)
      expect(result).toStrictEqual(data)
    })
  })

  describe('update', () => {
    it('should update an model', async () => {
      const data = await sut.insert(model)

      const modelUpdate = {
        id: data.id,
        description: 'updated description',
        type: 'test type',
        quantity: 5,
        stockMax: 15,
        stockMin: 2,
        created_at,
        updated_at,
      }

      const result = await sut.update(modelUpdate)
      expect(result).toStrictEqual(sut.items[0])
    })
  })

  describe('delete', () => {
    it('Should throw error when id not found', async () => {
      await expect(sut.delete('fake_id')).rejects.toThrow(
        new NotFoundError('Model not found using ID fake_id'),
      )

      const id = randomUUID()

      await expect(sut.delete(id)).rejects.toThrow(
        new NotFoundError(`Model not found using ID ${id}`),
      )
    })

    it('sould delete an model', async () => {
      const data = await sut.insert(model)
      expect(sut.items.length).toBe(1)
      await sut.delete(data.id)
      expect(sut.items.length).toBe(0)
    })
  })

  describe('applyFilter', () => {
    it('should no filter items when filter param is null', async () => {
      const items = [model]
      const spyFilterMethod = jest.spyOn(items, 'filter' as any)
      const result = await sut['applyFilter'](items, null)
      expect(spyFilterMethod).not.toHaveBeenCalled()
      expect(result).toStrictEqual(items)
    })

    it('should filter the date using filter name', async () => {
      const items = [
        {
          id: randomUUID(),
          description: 'test',
          type: 'serra',
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          description: 'TEST',
          type: 'Fresa',
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          description: 'fake',
          type: 'Broca',
          created_at,
          updated_at,
        },
      ]

      const spyFilterMethod = jest.spyOn(items, 'filter' as any)
      let result = await sut['applyFilter'](items, 'TEST')
      expect(spyFilterMethod).toHaveBeenCalledTimes(1)
      expect(result).toStrictEqual([items[0], items[1]])

      result = await sut['applyFilter'](items, 'test')
      expect(spyFilterMethod).toHaveBeenCalledTimes(2)
      expect(result).toStrictEqual([items[0], items[1]])

      result = await sut['applyFilter'](items, 'no-filter')
      expect(spyFilterMethod).toHaveBeenCalledTimes(3)
      expect(result).toHaveLength(0)
    })

    it('Should not sort items', async () => {
      const items = [
        {
          id: randomUUID(),
          description: 'test',
          type: 'serra',
          quantity: 5,
          stockMax: 20,
          stockMin: 2,
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          description: 'TEST',
          type: 'Fresa',
          quantity: 8,
          stockMax: 15,
          stockMin: 5,
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          description: 'fake',
          type: 'Broca',
          quantity: 2,
          stockMax: 10,
          stockMin: 2,
          created_at,
          updated_at,
        },
      ]

      let result = await sut['applySort'](items, null, null)
      expect(result).toStrictEqual(items)

      result = await sut['applySort'](items, 'id', 'asc')
      expect(result).toStrictEqual(items)
    })

    it('Should sort items', async () => {
      const items = [
        {
          id: randomUUID(),
          description: 'b',
          type: 'Broca',
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          description: 'a',
          type: 'Broca',
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          description: 'c',
          type: 'Broca',
          created_at,
          updated_at,
        },
      ]

      // let result = await sut['applySort'](items, 'description', 'desc')
      // expect(result).toStrictEqual([items[2], items[1], items[0]])

      let result = await sut['applySort'](items, 'description', 'asc')
      expect(result).toStrictEqual([items[0], items[1], items[2]])
    })
  })

  describe('applyPaginate', () => {
    it('Should paginate items', async () => {
      const items = [
        {
          id: randomUUID(),
          description: 'a',
          type: 'Broca',
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          description: 'b',
          type: 'Broca',
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          description: 'c',
          type: 'Broca',
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          description: 'd',
          type: 'Broca',
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          description: 'e',
          type: 'Broca',
          created_at,
          updated_at,
        },
      ]

      let result = await sut['applyPaginate'](items, 1, 2)
      expect(result).toStrictEqual([items[0], items[1]])

      result = await sut['applyPaginate'](items, 2, 2)
      expect(result).toStrictEqual([items[2], items[3]])

      result = await sut['applyPaginate'](items, 2, 3)
      expect(result).toStrictEqual([items[3], items[4]])
    })
  })

  describe('search', () => {
    it('Should paginate items', async () => {
      const items = Array(16).fill(model)
      sut.items = items

      const result = await sut.search({})
      expect(result).toStrictEqual({
        items: Array(15).fill(model),
        total: 16,
        current_page: 1,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      })
    })

    it('Should apply paginate and filter', async () => {
      const items = [
        {
          id: randomUUID(),
          description: 'test',
          type: 'Broca',
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          description: 'b',
          type: 'Broca',
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          description: 'TEST',
          type: 'Broca',
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          description: 'TeSt',
          type: 'Broca',
          created_at,
          updated_at,
        },
      ]
      sut.items = items

      const result = await sut.search({
        page: 1,
        per_page: 2,
        filter: 'test',
      })
      expect(result).toStrictEqual({
        items: [items[0], items[2]],
        total: 3,
        current_page: 1,
        per_page: 2,
        sort: null,
        sort_dir: null,
        filter: 'test',
      })
    })

    it('Should apply paginate and sort', async () => {
      const items = [
        {
          id: randomUUID(),
          description: 'b',
          type: 'Broca',
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          description: 'a',
          type: 'Broca',
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          description: 'd',
          type: 'Broca',
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          description: 'e',
          type: 'Broca',
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          description: 'c',
          type: 'Broca',
          created_at,
          updated_at,
        },
      ]
      sut.items = items

      let result = await sut.search({
        page: 1,
        per_page: 2,
        sort: 'description',
        sort_dir: 'asc',
      })
      expect(result).toStrictEqual({
        items: [items[1], items[0]],
        total: 5,
        current_page: 1,
        per_page: 2,
        sort: 'description',
        sort_dir: 'asc',
        filter: null,
      })

      result = await sut.search({
        page: 2,
        per_page: 2,
        sort: 'description',
        sort_dir: 'asc',
      })
      expect(result).toStrictEqual({
        items: [items[4], items[2]],
        total: 5,
        current_page: 2,
        per_page: 2,
        sort: 'name',
        sort_dir: 'asc',
        filter: null,
      })
    })

    it('Should search using filter, sort and paginate', async () => {
      const items = [
        {
          id: randomUUID(),
          description: 'TEST',
          type: 'broca',
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          description: 'a',
          type: 'Serra',
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          description: 'test',
          type: 'Fresa',
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          description: 'e',
          type: 'broca',
          created_at,
          updated_at,
        },
        {
          id: randomUUID(),
          description: 'TeSt',
          type: 'Serra',
          created_at,
          updated_at,
        },
      ]
      sut.items = items

      let result = await sut.search({
        page: 1,
        per_page: 2,
        sort: 'description',
        sort_dir: 'asc',
        filter: 'TEST',
      })
      expect(result).toStrictEqual({
        items: [items[0], items[2]],
        total: 3,
        current_page: 1,
        per_page: 2,
        sort: 'description',
        sort_dir: 'asc',
        filter: 'TEST',
      })

      result = await sut.search({
        page: 1,
        per_page: 2,
        sort: 'description',
        sort_dir: 'desc',
        filter: 'test',
      })

      expect(result).toStrictEqual({
        items: [items[0], items[2]],
        total: 3,
        current_page: 1,
        per_page: 2,
        sort: 'description',
        sort_dir: 'desc',
        filter: 'test',
      })
    })
  })
})
