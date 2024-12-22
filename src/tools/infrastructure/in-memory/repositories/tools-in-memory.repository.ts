import { ConflictError } from '@/common/domain/erros/conflict-error'
import { NotFoundError } from '@/common/domain/erros/not-found-error'
import { InMemoryRepository } from '@/common/domain/repositories/in-memory.repository'
import { ToolsModel } from '@/tools/domain/models/tools.model'
import { ToolId, ToolsRepository } from '@/tools/repositories/tools.repository'

export class ToolsInMemoryRepository
  extends InMemoryRepository<ToolsModel>
  implements ToolsRepository
{
  sortableFields: string[] = ['description', 'created_at']

  async findByDescription(description: string): Promise<ToolsModel> {
    const tool = this.items.find(item => item.description === description)

    if (!tool) {
      throw new NotFoundError(`Tool not found using description ${description}`)
    }
    return tool
  }

  async findAllByIds(toolIds: ToolId[]): Promise<ToolsModel[]> {
    const existingTool = []

    for (const toolId of toolIds) {
      const tool = this.items.find(item => item.id === toolId.id)

      if (tool) {
        existingTool.push(tool)
      }

      return existingTool
    }
  }

  async confinctingDescription(description: string): Promise<void> {
    const tool = this.items.find(item => item.description === description)

    if (tool) {
      throw new ConflictError('Description already used on another tool')
    }
  }

  protected async applyFilter(
    items: ToolsModel[],
    filter: string | null,
  ): Promise<ToolsModel[]> {
    if (!filter) return items
    return items.filter(item =>
      item.description.toLowerCase().includes(filter.toLowerCase()),
    )
  }

  protected async applySort(
    items: ToolsModel[],
    sort: string | null,
    sort_dir: string | null,
  ): Promise<ToolsModel[]> {
    return super.applySort(items, sort ?? 'created_at', sort_dir ?? 'desc')
  }
}
