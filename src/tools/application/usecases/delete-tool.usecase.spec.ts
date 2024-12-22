import 'reflect-metadata'
import { ToolsInMemoryRepository } from '@/tools/infrastructure/in-memory/repositories/tools-in-memory.repository'
import { DeleteToolUseCase } from './delete-tool.usecase'
import { NotFoundError } from '@/common/domain/erros/not-found-error'
import { ToolsDataBuilder } from '@/tools/infrastructure/testing/helpers/tools-data-build'

describe('DeleteToolUseCase Unit Tests', () => {
  let sut: DeleteToolUseCase.UseCase
  let repository: ToolsInMemoryRepository

  beforeEach(() => {
    repository = new ToolsInMemoryRepository()
    sut = new DeleteToolUseCase.UseCase(repository)
  })

  it('Should throw error when tool not found', async () => {
    await expect(sut.execute({ id: 'fake_id' })).rejects.toBeInstanceOf(
      NotFoundError,
    )
  })

  it('Should be able to delete a tool', async () => {
    const spyDelete = jest.spyOn(repository, 'delete')
    const tool = await repository.insert(ToolsDataBuilder({}))
    expect(repository.items.length).toBe(1)

    await sut.execute({ id: tool.id })
    expect(spyDelete).toHaveBeenCalledTimes(1)
    expect(repository.items.length).toBe(0)
  })
})
