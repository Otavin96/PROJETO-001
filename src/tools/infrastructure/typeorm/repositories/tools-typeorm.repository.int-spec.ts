import { randomUUID } from 'node:crypto'
import { Tool } from '../entities/tools.entities'
import { testDataSource } from '../testing/data-source'
import { ToolsTypeormRepository } from './tools-typeorm.repository'
import { NotFoundError } from '@/common/domain/erros/not-found-error'
import { ToolsDataBuilder } from '../../testing/helpers/tools-data-build'
import { ConflictError } from '@/common/domain/erros/conflict-error'
import { ToolsModel } from '@/tools/domain/models/tools.model'

describe('ToolsTypeormRepository integration tests', () => {
  let ormRepository: ToolsTypeormRepository
  let typeormEntityManager: any

  beforeAll(async () => {
    await testDataSource.initialize()
    typeormEntityManager = testDataSource.createEntityManager()
  })

  afterAll(async () => {
    await testDataSource.destroy()
  })

  beforeEach(async () => {
    await testDataSource.manager.query('DELETE FROM tools')
    ormRepository = new ToolsTypeormRepository(
      typeormEntityManager.getRepository(Tool),
    )
  })

  describe('findById', () => {
    it('should geneate an error when the tool is not found', async () => {
      const id = randomUUID()

      await expect(ormRepository.findById(id)).rejects.toThrow(
        new NotFoundError(`Tool not found using ID ${id}`),
      )
    })

    it('should finds a tool by id', async () => {
      const data = ToolsDataBuilder({})
      const tool = testDataSource.manager.create(Tool, data)
      await testDataSource.manager.save(tool)

      const result = await ormRepository.findById(tool.id)
      expect(result.id).toEqual(tool.id)
      expect(result.description).toEqual(tool.description)
    })
  })

  describe('create', () => {
    it('should create a new Tool object', () => {
      const data = ToolsDataBuilder({ description: 'Tool 1' })
      const result = ormRepository.create(data)
      expect(result.description).toStrictEqual(data.description)
    })
  })

  describe('insert', () => {
    it('should insert a new Tool object', async () => {
      const data = ToolsDataBuilder({ description: 'Tool 1' })
      const result = await ormRepository.insert(data)
      expect(result.description).toStrictEqual(data.description)
    })
  })

  describe('update', () => {
    it('should generate an error when  the tool is not found', async () => {
      const data = ToolsDataBuilder({})

      await expect(ormRepository.update(data)).rejects.toThrow(
        new NotFoundError(`Tool not found using ID ${data.id}`),
      )
    })

    it('should update a tool', async () => {
      const data = ToolsDataBuilder({})
      const tool = testDataSource.manager.create(Tool, data)
      await testDataSource.manager.save(tool)
      tool.description = 'Fresa 10mm CT70'

      const result = await ormRepository.update(tool)
      expect(result.description).toEqual('Fresa 10mm CT70')
    })
  })

  describe('delete', () => {
    it('should generate an error when  the tool is not found', async () => {
      const data = ToolsDataBuilder({})

      await expect(ormRepository.update(data)).rejects.toThrow(
        new NotFoundError(`Tool not found using ID ${data.id}`),
      )
    })

    it('should delete a tool', async () => {
      const data = ToolsDataBuilder({})
      const tool = testDataSource.manager.create(Tool, data)
      await testDataSource.manager.save(tool)

      await ormRepository.delete(data.id)

      const result = await testDataSource.manager.findOneBy(Tool, {
        id: data.id,
      })

      expect(result).toBeNull()
    })
  })

  describe('findByDescription', () => {
    it('should generate an error when the user is not found', async () => {
      const description = 'Fresa 10mm'
      await expect(
        ormRepository.findByDescription(description),
      ).rejects.toThrow(
        new NotFoundError(`Tool not found using description ${description}`),
      )
    })

    it('should finds a tool by description', async () => {
      const data = ToolsDataBuilder({ description: 'Fresa 10mm CT70' })
      const tool = testDataSource.manager.create(Tool, data)
      await testDataSource.manager.save(tool)

      const result = await ormRepository.findByDescription(data.description)
      expect(result.description).toEqual('Fresa 10mm CT70')
    })
  })

  describe('confinctingDescription', () => {
    it('should generate an error when the tool found', async () => {
      const data = ToolsDataBuilder({ description: 'Fresa 10mm' })
      const tool = testDataSource.manager.create(Tool, data)
      await testDataSource.manager.save(tool)

      await expect(
        ormRepository.confinctingDescription('Fresa 10mm'),
      ).rejects.toThrow(
        new ConflictError(`Description already used by another tools`),
      )
    })
  })

  describe('search', () => {
    it('should apply only pagination when the other params are null', async () => {
      const arrange = Array(16).fill(ToolsDataBuilder({}))
      arrange.map(element => delete element.id)
      const data = testDataSource.manager.create(Tool, arrange)
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
      const models: ToolsModel[] = []
      const arrange = Array(16).fill(ToolsDataBuilder({}))
      arrange.forEach((element, index) => {
        delete element.id
        models.push({
          ...element,
          description: `Tool ${index}`,
          created_at: new Date(created_at.getTime() + index),
        })
      })
      const data = testDataSource.manager.create(Tool, models)
      await testDataSource.manager.save(data)

      const result = await ormRepository.search({
        page: 1,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      })

      expect(result.items[0].description).toEqual('Tool 15')
      expect(result.items[14].description).toEqual('Tool 1')
    })

    it('should apply paginate and sort', async () => {
      const created_at = new Date()
      const models: ToolsModel[] = []
      'badec'.split('').forEach((element, index) => {
        models.push({
          ...ToolsDataBuilder({}),
          description: element,
          created_at: new Date(created_at.getTime() + index),
        })
      })
      const data = testDataSource.manager.create(Tool, models)
      await testDataSource.manager.save(data)

      let result = await ormRepository.search({
        page: 1,
        per_page: 2,
        sort: 'description',
        sort_dir: 'ASC',
        filter: null,
      })

      expect(result.items[0].description).toEqual('a')
      expect(result.items[1].description).toEqual('b')
      expect(result.items.length).toEqual(2)

      result = await ormRepository.search({
        page: 1,
        per_page: 2,
        sort: 'description',
        sort_dir: 'DESC',
        filter: null,
      })

      expect(result.items[0].description).toEqual('e')
      expect(result.items[1].description).toEqual('d')
      expect(result.items.length).toEqual(2)
    })

    it('should search using filter, sort and paginate', async () => {
      const created_at = new Date()
      const models: ToolsModel[] = []
      const values = ['test', 'a', 'TEST', 'b', 'TeSt']
      values.forEach((element, index) => {
        models.push({
          ...ToolsDataBuilder({}),
          description: element,
          created_at: new Date(created_at.getTime() + index),
        })
      })
      const data = testDataSource.manager.create(Tool, models)
      await testDataSource.manager.save(data)

      let result = await ormRepository.search({
        page: 1,
        per_page: 2,
        sort: 'description',
        sort_dir: 'ASC',
        filter: 'TEST',
      })

      console.log(result)

      expect(result.items[0].description).toEqual('test')
      expect(result.items[1].description).toEqual('TeSt')
      expect(result.items.length).toEqual(2)
      expect(result.total).toEqual(3)

      result = await ormRepository.search({
        page: 2,
        per_page: 2,
        sort: 'description',
        sort_dir: 'ASC',
        filter: 'TEST',
      })

      expect(result.items[0].description).toEqual('TEST')
      expect(result.items.length).toEqual(1)
      expect(result.total).toEqual(3)
    })
  })
})
