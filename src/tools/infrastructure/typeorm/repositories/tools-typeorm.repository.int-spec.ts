import { randomUUID } from 'node:crypto'
import { Tool } from '../entities/tools.entities'
import { testDataSource } from '../testing/data-source'
import { ToolsTypeormRepository } from './tools-typeorm.repository'
import { NotFoundError } from '@/common/domain/erros/not-found-error'
import { ToolsDataBuilder } from '../../testing/helpers/tools-data-build'

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
      new NotFoundError(`Tool not found using ID ${data.id}`)
     )
    })
  })
})
