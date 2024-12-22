import 'reflect-metadata'
import { ToolsInMemoryRepository } from '@/tools/infrastructure/in-memory/repositories/tools-in-memory.repository'
import { UpdateToolUserCase } from './update-tool.usercase'
import { NotFoundError } from '@/common/domain/erros/not-found-error'
import { ToolsDataBuilder } from '@/tools/infrastructure/testing/helpers/tools-data-build'

describe('UpdateToolUseCase unit test', () => {
  let sut: UpdateToolUserCase.UseCase
  let repository: ToolsInMemoryRepository

  beforeEach(() => {
    repository = new ToolsInMemoryRepository()
    sut = new UpdateToolUserCase.UseCase(repository)
  })

  it('Should throw error when tool not found', async () => {
    await expect(sut.execute({ id: 'fake_id' })).rejects.toBeInstanceOf(
      NotFoundError,
    )
  })

  it('Should be able to update a tool', async () => {
    const spyUpdate = jest.spyOn(repository, 'update')
    const props = {
      description: 'Fresa 10mm',
      type: 'fresa',
      quantity: 10,
      stockMin: 2,
      stockMax: 8,
    }

    const model = repository.create(props)
    await repository.insert(model)

    const newData = {
      id: model.id,
      description: 'Fresa 10mm Atualizada',
      quantity: 20,
    }

    const result = await sut.execute(newData)
    expect(result.description).toEqual(newData.description)
    expect(result.quantity).toEqual(newData.quantity)
    expect(spyUpdate).toHaveBeenCalledTimes(1)
  })
})
