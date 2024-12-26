import { testDataSource } from '@/tools/infrastructure/typeorm/testing/data-source'
import { SuppliersTypeormRepository } from './suppliers-typeorm.repository'
import { Supplier } from '../entities/suppliers.entities'
import { randomUUID } from 'node:crypto'
import { NotFoundError } from '@/common/domain/erros/not-found-error'
import { SuppliersDataBuilder } from '../../testing/helpers/suppliers-data-build'
import { da } from '@faker-js/faker/.'
import { ConflictError } from '@/common/domain/erros/conflict-error'
import { SuppliersModel } from '@/suppliers/domain/models/suppliers.model'

describe('SuppliersTypeormRepository unit tests', () => {
  let ormRepository: SuppliersTypeormRepository
  let typeormEntityManager: any

  beforeAll(async () => {
    await testDataSource.initialize()
    typeormEntityManager = testDataSource.createEntityManager()
  })

  afterAll(async () => {
    await testDataSource.destroy()
  })

  beforeEach(async () => {
    await testDataSource.manager.query('DELETE FROM suppliers')
    ormRepository = new SuppliersTypeormRepository(
      typeormEntityManager.getRepository(Supplier),
    )
  })

  describe('findById', () => {
    it('should generate an error when  the supplier is not found', async () => {
      const id = randomUUID()

      await expect(ormRepository.findById(id)).rejects.toThrow(
        new NotFoundError(`Supplier not found using ID ${id}`),
      )
    })

    it('should finds a supplier by id', async () => {
      const data = SuppliersDataBuilder({})
      const supplier = testDataSource.manager.create(Supplier, data)
      await testDataSource.manager.save(supplier)

      const result = await ormRepository.findById(supplier.id)
      expect(result.id).toEqual(supplier.id)
      expect(result.name).toEqual(supplier.name)
    })
  })

  describe('create', () => {
    it('should create a new supplier', async () => {
      const data = SuppliersDataBuilder({ name: 'Diamantec' })
      const result = ormRepository.create(data)
      expect(result.name).toEqual(data.name)
    })
  })

  describe('insert', () => {
    it('should insert a new supplier', async () => {
      const data = SuppliersDataBuilder({ name: 'Diamantec' })
      const result = await ormRepository.insert(data)
      expect(result.name).toEqual(data.name)
    })
  })

  describe('update', () => {
    it('should generate an error when the supplier is not found', async () => {
      const data = SuppliersDataBuilder({})

      await expect(ormRepository.update(data)).rejects.toThrow(
        new NotFoundError(`Supplier not found using ID ${data.id}`),
      )
    })

    it('should update a supplier', async () => {
      const data = SuppliersDataBuilder({})
      const supplier = testDataSource.manager.create(Supplier, data)
      await testDataSource.manager.save(supplier)

      supplier.name = 'Nome atualizado'

      const result = await ormRepository.update(supplier)
      expect(result.name).toEqual('Nome atualizado')
    })
  })

  describe('delete', () => {
    it('should generate an error when the supplier is not found', async () => {
      const id = randomUUID()

      await expect(ormRepository.delete(id)).rejects.toThrow(
        new NotFoundError(`Supplier not found using ID ${id}`),
      )
    })

    it('should delete a supplier', async () => {
      const data = SuppliersDataBuilder({})
      const supplier = testDataSource.manager.create(Supplier, data)
      await testDataSource.manager.save(supplier)

      await ormRepository.delete(data.id)

      const result = await testDataSource.manager.findOneBy(Supplier, {
        id: data.id,
      })
      expect(result).toBeNull()
    })
  })

  describe('findByName', () => {
    it('should generate an error if the name of the supplier is not found', async () => {
      const name = 'Diamantec'

      await expect(ormRepository.findByName(name)).rejects.toThrow(
        new NotFoundError(`Supplier not found using name ${name}`),
      )
    })

    it('should finds a supplier by name', async () => {
      const data = SuppliersDataBuilder({ name: 'Diamantec' })
      const supplier = testDataSource.manager.create(Supplier, data)
      await testDataSource.manager.save(supplier)

      const result = await ormRepository.findByName(data.name)
      expect(result.name).toEqual('Diamantec')
    })
  })

  describe('conflictingName', () => {
    it('should generate an error when the supplier found', async () => {
      const data = SuppliersDataBuilder({ name: 'Diamantec' })
      const supplier = testDataSource.manager.create(Supplier, data)
      await testDataSource.manager.save(supplier)

      await expect(ormRepository.conflictingName('Diamantec')).rejects.toThrow(
        new ConflictError('Name already used on another supplier'),
      )
    })
  })

  describe('findByAllIds', () => {
    it('should return an empty array when not find the products', async () => {
      const productsIds = [
        { id: 'e0b242a9-9606-4b25-ad24-8e6e2207ae45' },
        { id: randomUUID() },
      ]

      const result = await ormRepository.findByAllIds(productsIds)
      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })

    it('should find a products by the id field', async () => {
      const suppliersIds = [
        { id: 'e0b242a9-9606-4b25-ad24-8e6e2207ae45' },
        { id: randomUUID() },
      ]

      const data = SuppliersDataBuilder({ id: suppliersIds[0].id })
      const product = testDataSource.manager.create(Supplier, data)
      await testDataSource.manager.save(product)

      const result = await ormRepository.findByAllIds(suppliersIds)
      expect(result).toHaveLength(1)
    })
  })

  describe('search', () => {
    it('should apply only pagination when the other params are null', async () => {
      const arrange = Array(16).fill(SuppliersDataBuilder({}))
      arrange.map(element => delete element.id)
      const data = testDataSource.manager.create(Supplier, arrange)
      await testDataSource.manager.save(data)

      const result = await ormRepository.search({
        page: 1,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      })

      console.log(result)

      expect(result.total).toEqual(16)
      expect(result.items.length).toEqual(15)
    })

    it('should order by created_at DESC when search params are null', async () => {
      const created_at = new Date()
      const models: SuppliersModel[] = []
      const arrange = Array(16).fill(SuppliersDataBuilder({}))
      arrange.forEach((element, index) => {
        delete element.id
        models.push({
          ...element,
          name: `Supplier ${index}`,
          created_at: new Date(created_at.getTime() + index),
        })
      })
      const data = testDataSource.manager.create(Supplier, models)
      await testDataSource.manager.save(data)

      const result = await ormRepository.search({
        page: 1,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      })

      expect(result.items[0].name).toEqual('Supplier 15')
      expect(result.items[14].name).toEqual('Supplier 1')
    })

    it('should apply paginate and sort', async () => {
      const created_at = new Date()
      const models: SuppliersModel[] = []
      'badec'.split('').forEach((element, index) => {
        models.push({
          ...SuppliersDataBuilder({}),
          name: element,
          created_at: new Date(created_at.getTime() + index),
        })
      })
      const data = testDataSource.manager.create(Supplier, models)
      await testDataSource.manager.save(data)

      let result = await ormRepository.search({
        page: 1,
        per_page: 2,
        sort: 'name',
        sort_dir: 'ASC',
        filter: null,
      })

      expect(result.items[0].name).toEqual('a')
      expect(result.items[1].name).toEqual('b')
      expect(result.items.length).toEqual(2)

      result = await ormRepository.search({
        page: 1,
        per_page: 2,
        sort: 'name',
        sort_dir: 'DESC',
        filter: null,
      })

      expect(result.items[0].name).toEqual('e')
      expect(result.items[1].name).toEqual('d')
      expect(result.items.length).toEqual(2)
    })

    it('should search using filter, sort and paginate', async () => {
      const created_at = new Date()
      const models: SuppliersModel[] = []
      const values = ['test', 'a', 'TEST', 'b', 'TeSt']
      values.forEach((element, index) => {
        models.push({
          ...SuppliersDataBuilder({}),
          name: element,
          created_at: new Date(created_at.getTime() + index),
        })
      })
      const data = testDataSource.manager.create(Supplier, models)
      await testDataSource.manager.save(data)

      let result = await ormRepository.search({
        page: 1,
        per_page: 2,
        sort: 'name',
        sort_dir: 'ASC',
        filter: 'TEST',
      })

      expect(result.items[0].name).toEqual('test')
      expect(result.items[1].name).toEqual('TeSt')
      expect(result.items.length).toEqual(2)
      expect(result.total).toEqual(3)

      result = await ormRepository.search({
        page: 2,
        per_page: 2,
        sort: 'name',
        sort_dir: 'ASC',
        filter: 'TEST',
      })

      expect(result.items[0].name).toEqual('TEST')
      expect(result.items.length).toEqual(1)
      expect(result.total).toEqual(3)
    })
  })
})
