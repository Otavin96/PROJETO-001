import { testDataSource } from '@/tools/infrastructure/typeorm/testing/data-source'
import { StockMovementTypeormRepository } from './stockMovement-typeorm.repository'
import { randomUUID } from 'crypto'
import { NotFoundError } from '@/common/domain/erros/not-found-error'
import { StockMovementDataBuilder } from '../../testing/helpers/stockMovement-data-build'
import { StockMovement } from '../entities/stockMovements.entities'
import { StockMovementModel } from '@/stockMovements/domain/models/stockMovements.model'

describe('StockMovementTypeormRepository integration tests', () => {
  let ormRepository: StockMovementTypeormRepository
  let typeormEntityManager: any

  beforeAll(async () => {
    await testDataSource.initialize()
    typeormEntityManager = testDataSource.createEntityManager()
  })

  afterAll(async () => {
    await testDataSource.destroy()
  })

  beforeEach(async () => {
    await testDataSource.manager.query('DELETE FROM stockMovements')
    ormRepository = new StockMovementTypeormRepository(
      typeormEntityManager.getRepository(StockMovement),
    )
  })

  describe('findById', () => {
    it('should generate an error when the stockMovement is not found', async () => {
      const id = randomUUID()
      await expect(ormRepository.findById(id)).rejects.toThrow(
        new NotFoundError(`StockMovement not found using ID ${id}`),
      )
    })

    it('should finds a stockMovement by id', async () => {
      const data = StockMovementDataBuilder({})
      const stockMovement = testDataSource.manager.create(StockMovement, data)
      await testDataSource.manager.save(stockMovement)

      const result = await ormRepository.findById(stockMovement.id)
      expect(result.id).toEqual(stockMovement.id)
      expect(result.tool_id).toEqual(stockMovement.tool_id)
      expect(result.user_id).toEqual(stockMovement.user_id)
      expect(result.supplier_id).toEqual(stockMovement.supplier_id)
      expect(result.reason).toEqual(stockMovement.reason)
      expect(result.movement_type).toEqual(stockMovement.movement_type)
    })
  })

  describe('create', () => {
    it('should create a new stockMovement object', () => {
      const data = StockMovementDataBuilder({})
      const result = ormRepository.create(data)
      expect(result.id).toEqual(data.id)
      expect(result.tool_id).toEqual(data.tool_id)
      expect(result.user_id).toEqual(data.user_id)
      expect(result.supplier_id).toEqual(data.supplier_id)
      expect(result.reason).toEqual(data.reason)
      expect(result.movement_type).toEqual(data.movement_type)
    })
  })

  describe('insert', () => {
    it('should insert a new stockMovement', async () => {
      const data = StockMovementDataBuilder({})
      const result = await ormRepository.insert(data)
      expect(result.tool_id).toEqual(data.tool_id)
      expect(result.user_id).toEqual(data.user_id)
      expect(result.supplier_id).toEqual(data.supplier_id)
      expect(result.reason).toEqual(data.reason)
      expect(result.movement_type).toEqual(data.movement_type)
    })
  })

  describe('update', () => {
    it('should generate an error when the stockMovement is not found', async () => {
      const data = StockMovementDataBuilder({})
      await expect(ormRepository.update(data)).rejects.toThrow(
        new NotFoundError(`User not found using ID ${data.id}`),
      )
    })

    it('should update a stockMovement', async () => {
      const data = StockMovementDataBuilder({})
      const stockMovement = testDataSource.manager.create(StockMovement, data)
      await testDataSource.manager.save(stockMovement)
      stockMovement.reason = 'Ferramenta quebrou'

      const result = await ormRepository.update(stockMovement)
      expect(result.reason).toEqual('Ferramenta quebrou')
    })
  })

  describe('delete', () => {
    it('should generate an error when the stockMovement is not found', async () => {
      const data = StockMovementDataBuilder({})
      await expect(ormRepository.update(data)).rejects.toThrow(
        new NotFoundError(`User not found using ID ${data.id}`),
      )
    })

    it('should delete a stockMovement', async () => {
      const data = StockMovementDataBuilder({})
      const stockMovement = testDataSource.manager.create(StockMovement, data)
      await testDataSource.manager.save(stockMovement)

      await ormRepository.delete(data.id)

      const result = await testDataSource.manager.findOneBy(StockMovement, {
        id: data.id,
      })
      expect(result).toBeNull()
    })
  })

  describe('search', () => {
    it('should apply only pagination when the other params are null', async () => {
      const arrange = Array(16).fill(StockMovementDataBuilder({}))
      arrange.map(element => delete element.id)
      const data = testDataSource.manager.create(StockMovement, arrange)
      await testDataSource.manager.save(data)

      const result = await ormRepository.search({
        page: 1,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      })

      expect(result.total).toEqual(16)
      expect(result.items.length).toEqual(15)
    })

    it('should order by created_at DESC when search params are null', async () => {
      const created_at = new Date()
      const models: StockMovementModel[] = []
      const arrange = Array(16).fill(StockMovementDataBuilder({}))
      arrange.forEach((element, index) => {
        delete element.id
        models.push({
          ...element,
          reason: `StockMovement ${index}`,
          created_at: new Date(created_at.getTime() + index),
        })
      })
      const data = testDataSource.manager.create(StockMovement, models)
      await testDataSource.manager.save(data)

      const result = await ormRepository.search({
        page: 1,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      })

      expect(result.items[0].reason).toEqual('User 15')
      expect(result.items[14].reason).toEqual('User 1')
    })

    it('should apply paginate and sort', async () => {
      const created_at = new Date()
      const models: StockMovementModel[] = []
      'badec'.split('').forEach((element, index) => {
        models.push({
          ...StockMovementDataBuilder({}),
          reason: element,
          created_at: new Date(created_at.getTime() + index),
        })
      })
      const data = testDataSource.manager.create(StockMovement, models)
      await testDataSource.manager.save(data)

      let result = await ormRepository.search({
        page: 1,
        per_page: 2,
        sort: 'reason',
        sort_dir: 'ASC',
        filter: null,
      })

      expect(result.items[0].reason).toEqual('a')
      expect(result.items[1].reason).toEqual('b')
      expect(result.items.length).toEqual(2)

      result = await ormRepository.search({
        page: 1,
        per_page: 2,
        sort: 'reason',
        sort_dir: 'DESC',
        filter: null,
      })

      expect(result.items[0].reason).toEqual('e')
      expect(result.items[1].reason).toEqual('d')
      expect(result.items.length).toEqual(2)
    })

    it('should search using filter, sort and paginate', async () => {
      const created_at = new Date()
      const models: StockMovementModel[] = []
      const values = ['test', 'a', 'TEST', 'b', 'TeSt']
      values.forEach((element, index) => {
        models.push({
          ...StockMovementDataBuilder({}),
          reason: element,
          created_at: new Date(created_at.getTime() + index),
        })
      })
      const data = testDataSource.manager.create(StockMovement, models)
      await testDataSource.manager.save(data)

      let result = await ormRepository.search({
        page: 1,
        per_page: 2,
        sort: 'reason',
        sort_dir: 'ASC',
        filter: 'TEST',
      })

      expect(result.items[0].reason).toEqual('test')
      expect(result.items[1].reason).toEqual('TeSt')
      expect(result.items.length).toEqual(2)
      expect(result.total).toEqual(3)

      result = await ormRepository.search({
        page: 2,
        per_page: 2,
        sort: 'reason',
        sort_dir: 'ASC',
        filter: 'TEST',
      })

      expect(result.items[0].reason).toEqual('TEST')
      expect(result.items.length).toEqual(1)
      expect(result.total).toEqual(3)
    })
  })
})
