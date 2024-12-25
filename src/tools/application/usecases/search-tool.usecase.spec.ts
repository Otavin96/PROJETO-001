import { ToolsInMemoryRepository } from "@/tools/infrastructure/in-memory/repositories/tools-in-memory.repository"
import { ToolsRepository } from "@/tools/repositories/tools.repository"
import { SearchToolUseCase } from "./search-tool.usecase"
import { ToolsDataBuilder } from "@/tools/infrastructure/testing/helpers/tools-data-build"

describe('SearchToolUseCase unit tests', () => {
  let sut: SearchToolUseCase.UseCase
  let repository: ToolsInMemoryRepository

  beforeEach(() => {
    repository = new ToolsInMemoryRepository()
    sut = new SearchToolUseCase.UseCase(repository)
  })

  test('Should return the tools ordered by created_at', async () => {
    const created_at = new Date()
    const items = [
      {...ToolsDataBuilder({})},
      {
        ...ToolsDataBuilder({
          created_at: new Date(created_at.getTime() + 100)
        })
      },
      {
        ...ToolsDataBuilder({
          created_at: new Date(created_at.getTime() + 200)
        })
      }
    ]

    repository.items = items

    const result = await sut.execute({})

    expect(result).toStrictEqual({
      items: [...items].reverse(),
      total: 3,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    })
  })

  test('should return output using pagination, sort and filter', async () => {
    const items = [
      { ...ToolsDataBuilder({ description: 'a' })},
      { ...ToolsDataBuilder({ description: 'AA' })},
      { ...ToolsDataBuilder({ description: 'Aa' })},
      { ...ToolsDataBuilder({ description: 'b' })},
      { ...ToolsDataBuilder({ description: 'c' })},
    ]
    repository.items = items

    let output = await sut.execute({
      page: 1,
      per_page: 2,
      sort: 'description',
      sort_dir: 'asc',
      filter: 'a',
    })

    expect(output).toStrictEqual({
      items: [items[1], items[2]],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    })

    output = await sut.execute({
      page: 1,
      per_page: 2,
      sort: 'description',
      sort_dir: 'desc',
      filter: 'a',
    })

    expect(output).toStrictEqual({
      items: [items[0], items[2]],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    })
  })

})
