import 'reflect-metadata'
import { ToolsRepository } from '@/tools/repositories/tools.repository'
import { GetToolUseCase } from './get-tool.usecase'
import { ToolsInMemoryRepository } from '@/tools/infrastructure/in-memory/repositories/tools-in-memory.repository'
import { NotFoundError } from '@/common/domain/erros/not-found-error'

describe('GetToolUseCase Unit Tests', () => {
  let sut: GetToolUseCase.UseCase
  let repository: ToolsRepository

  beforeEach(() => {
    repository = new ToolsInMemoryRepository()
    sut = new GetToolUseCase.UseCase(repository)
  })

  it('Should be able to get a tool', async () => {
    const spyFindById = jest.spyOn(repository, 'findById')
    const props = {
      description: 'Fresa 10',
      type: 'Fresa',
      quantity: 10,
      stockMax: 20,
      stockMin: 5,
    }

    const model = repository.create(props)
    await repository.insert(model)

    const result = await sut.execute({ id: model.id })
    expect(result).toMatchObject(props)
    expect(spyFindById).toHaveBeenCalledTimes(1)
  })

  it('Should throw error when tool not found', async () => {
    await expect(sut.execute({ id: 'fake_id' })).rejects.toBeInstanceOf(
      NotFoundError,
    )
  })
})
