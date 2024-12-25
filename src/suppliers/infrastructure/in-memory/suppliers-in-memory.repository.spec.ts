import { NotFoundError } from "@/common/domain/erros/not-found-error"
import { SuppliersInMemoryRepository } from "./suppliers-in-memory.repository"
import { SuppliersDataBuilder } from "../testing/helpers/suppliers-data-build"
import { ConflictError } from "@/common/domain/erros/conflict-error"

describe('SuppliersInMemoryRepository unit tests', () => {
  let sut: SuppliersInMemoryRepository

  beforeEach(() => {
    sut = new SuppliersInMemoryRepository()
  })

  describe('findByName', () => {

    it('should thorow erro when supplier not found', async () => {
      await expect(() => sut.findByName('fake-name')).rejects.toThrow(
        new NotFoundError('Supplier not found using name fake-name')
      )

      await expect(() => sut.findByName('fake-name')).rejects.toBeInstanceOf(
        NotFoundError
      )
    })

    it('should find a supplier by name', async () => {
      const data = SuppliersDataBuilder({ name: 'Yma' })

      sut.items.push(data)

      const result = await sut.findByName('Yma')
      expect(result).toStrictEqual(data)
    })
  })

  describe('conflictingName', () => {

    it('should throw error when supplier found', async () => {
      const data = SuppliersDataBuilder({ name: 'Yma' })
      sut.items.push(data)

      await expect(() => sut.conflictingName('Yma')).rejects.toThrow(
        new ConflictError('Name already used on another supplier')
      )

      await expect(() => sut.conflictingName('Yma')).rejects.toBeInstanceOf(ConflictError)
    })
    
    it('should not find a supplier by name', async () => {
      expect.assertions(0)
      await sut.conflictingName('Yma')
    })
  })
})
