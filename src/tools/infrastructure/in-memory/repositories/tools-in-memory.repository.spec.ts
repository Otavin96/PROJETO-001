import { NotFoundError } from '@/common/domain/erros/not-found-error'
import { ToolsInMemoryRepository } from './tools-in-memory.repository'
import { ToolsDataBuilder } from '../../testing/helpers/tools-data-build'
import { ConflictError } from '@/common/domain/erros/conflict-error'

describe('ToolsInMemmoryRepository unit tests', () => {
  let sut: ToolsInMemoryRepository

  beforeEach(() => {
    sut = new ToolsInMemoryRepository()
  })

  describe('findByDescription', () => {
    it('should throw error when tool not found', async () => {
      await expect(() => sut.findByDescription('fake_name')).rejects.toThrow(
        new NotFoundError('Tool not found using description fake_name'),
      )

      await expect(() =>
        sut.findByDescription('fake_name'),
      ).rejects.toBeInstanceOf(NotFoundError)
    })

    it('should find a tool by description', async () => {
      const data = ToolsDataBuilder({ description: 'Curso nodejs' })
      sut.items.push(data)

      const result = await sut.findByDescription('Curso nodejs')
      expect(result).toStrictEqual(data)
    })
  })

  describe('conflictingDescription', () => {
    it('should throw error when tool found', async () => {
      const data = ToolsDataBuilder({ description: 'Curso nodejs' })
      sut.items.push(data)

      await expect(() =>
        sut.confinctingDescription('Curso nodejs'),
      ).rejects.toThrow(
        new ConflictError('Description already used on another tool'),
      )

      await expect(() =>
        sut.confinctingDescription('Curso nodejs'),
      ).rejects.toBeInstanceOf(ConflictError)
    })

    it('should not find a product by name', async () => {
      expect.assertions(0)
      await sut.confinctingDescription('Curso nodejs')
    })
  })

  describe('applyFilter', () => {
    it('should no filter items when filter param is null', async () => {
      const data = ToolsDataBuilder({})
      sut.items.push(data)
      const spyFilterMethod = jest.spyOn(sut.items, 'filter' as any)
      const result = await sut['applyFilter'](sut.items, null)
      expect(spyFilterMethod).not.toHaveBeenCalled()
      expect(result).toStrictEqual(sut.items)
    })

    it('should filter the date using filter name', async () => {
      const items = [
        ToolsDataBuilder({ description: 'Test' }),
        ToolsDataBuilder({ description: 'TEST' }),
        ToolsDataBuilder({ description: 'fake' }),
      ]

      sut.items.push(...items)
      const spyFilterMethod = jest.spyOn(sut.items, 'filter' as any)
      const result = await sut['applyFilter'](sut.items, 'TEST')
      expect(spyFilterMethod).toHaveBeenCalledTimes(1)
      expect(result).toStrictEqual([items[0], items[1]])
    })
  })

  describe('applySort', () => {
    it('should sort items by created_at when sort param is null', async () => {
      const created_at = new Date()
      const items = [
        ToolsDataBuilder({ description: 'c', created_at: created_at }),
        ToolsDataBuilder({
          description: 'a',
          created_at: new Date(created_at.getTime() + 100),
        }),
        ToolsDataBuilder({
          description: 'b',
          created_at: new Date(created_at.getTime() + 200),
        }),
      ]

      sut.items.push(...items)

      const result = await sut['applySort'](sut.items, null, null)
      expect(result).toStrictEqual([items[2], items[1], items[0]])
    })

    it('should sort items by description field', async () => {
      const created_at = new Date()
      const items = [
        ToolsDataBuilder({ description: 'c' }),
        ToolsDataBuilder({ description: 'a' }),
        ToolsDataBuilder({ description: 'b' }),
      ]

      sut.items.push(...items)

      const result = await sut['applySort'](sut.items, 'description', 'desc')
      expect(result).toStrictEqual([items[0], items[2], items[1]])
    })
  })
})
