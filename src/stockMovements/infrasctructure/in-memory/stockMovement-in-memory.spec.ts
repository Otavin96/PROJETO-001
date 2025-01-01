import { describe } from 'node:test'
import { StockMovementInMemoryRepository } from './stockMovement-in-memory'
import { StockMovementDataBuilder } from '../testing/helpers/stockMovement-data-build'

describe('StockMovementInMemory unit test', () => {
  let sut: StockMovementInMemoryRepository

  beforeEach(() => {
    sut = new StockMovementInMemoryRepository()
    sut.items = []
  })

  describe('applyFilter', () => {
    it('should no filter items when filter object is null', async () => {
      const stockMovement = StockMovementDataBuilder({})
      sut.insert(stockMovement)
      const spyFilter = jest.spyOn(sut.items, 'filter' as any)

      const filteredItems = await sut['applyFilter'](sut.items, null as any)
      expect(spyFilter).not.toHaveBeenCalled()
      expect(filteredItems).toStrictEqual(sut.items)
    })

    it('should filter reason field using filter paramenter', async () => {
      const items = [
        StockMovementDataBuilder({ reason: 'Test' }),
        StockMovementDataBuilder({ reason: 'TEST' }),
        StockMovementDataBuilder({ reason: 'fake' }),
      ]

      sut.items = items
      const spyFilter = jest.spyOn(items, 'filter' as any)

      const filteredItems = await sut['applyFilter'](sut.items, 'TEST')
      expect(spyFilter).toHaveBeenCalledTimes(1)
      expect(filteredItems).toStrictEqual([sut.items[0], sut.items[1]])
    })
  })

  describe('applySort', () => {
    it('should sort by created_at when sort param is null', async () => {
      const created_at = new Date()
      const items = [
        StockMovementDataBuilder({
          reason: 'c',
          created_at: created_at,
        }),
        StockMovementDataBuilder({
          reason: 'a',
          created_at: new Date(created_at.getTime() + 100),
        }),
        StockMovementDataBuilder({
          reason: 'b',
          created_at: new Date(created_at.getTime() + 200),
        }),
      ]

      sut.items = items
      const sortedItems = await sut['applySort'](sut.items, null, null)
      expect(sortedItems).toStrictEqual([
        sut.items[2],
        sut.items[1],
        sut.items[0],
      ])
    })

    it('should sort by reason field', async () => {
      const items = [
        StockMovementDataBuilder({ reason: 'c' }),
        StockMovementDataBuilder({ reason: 'b' }),
        StockMovementDataBuilder({ reason: 'a' }),
      ]

      sut.items = items

      let sortedItems = await sut['applySort'](sut.items, 'reason', 'asc')
      expect(sortedItems).toStrictEqual([
        sut.items[2],
        sut.items[1],
        sut.items[0],
      ])

      sortedItems = await sut['applySort'](sut.items, 'reason', 'desc')
      expect(sortedItems).toStrictEqual([
        sut.items[0],
        sut.items[1],
        sut.items[2],
      ])
    })
  })
})
