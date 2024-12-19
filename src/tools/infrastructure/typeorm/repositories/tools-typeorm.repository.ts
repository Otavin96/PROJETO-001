import {
  SearchInput,
  SearchOutput,
} from '@/common/domain/repositories/repository.interface'
import { ToolsModel } from '@/tools/domain/models/tools.model'
import {
  CreateToolProps,
  ToolId,
  ToolsRepository,
} from '@/tools/repositories/tools.repository'
import { ILike, In, Repository } from 'typeorm'
import { Tool } from '../entities/tools.entities'
import { NotFoundError } from '@/common/domain/erros/not-found-error'
import { ConflictError } from '@/common/domain/erros/conflict-error'

export class ToolsTypeormRepository implements ToolsRepository {
  sortableFields: string[] = ['description', 'created_at']

  constructor(private toolsRepository: Repository<Tool>) {}

  async findByDescription(description: string): Promise<ToolsModel> {
    const tool = await this.toolsRepository.findOne({ where: { description } })
    if (!tool) {
      throw new NotFoundError(`Tool not found using description ${description}`)
    }
    return tool
  }

  async findAllByIds(toolIds: ToolId[]): Promise<ToolsModel[]> {
    const ids = toolIds.map(toolId => toolId.id)
    const toolsFound = await this.toolsRepository.find({
      where: { id: In(ids) },
    })

    return toolsFound
  }
  async confinctingDescription(description: string): Promise<void> {
    const tools = this.toolsRepository.findOneBy({ description })

    if (tools) {
      throw new ConflictError(`Description already used by another tools`)
    }
  }
  create(props: CreateToolProps): ToolsModel {
    return this.toolsRepository.create(props)
  }
  async insert(model: ToolsModel): Promise<ToolsModel> {
    return await this.toolsRepository.save(model)
  }
  async findById(id: string): Promise<ToolsModel> {
    return this._get(id)
  }
  async update(model: ToolsModel): Promise<ToolsModel> {
    await this._get(model.id)
    await this.toolsRepository.update({ id: model.id }, model)
    return model
  }
  async delete(id: string): Promise<void> {
    await this._get(id)
    await this.toolsRepository.delete({ id })
  }
  async search(props: SearchInput): Promise<SearchOutput<ToolsModel>> {
    const validSort = this.sortableFields.includes(props.sort) || false
    const dirOps = ['asc', 'desc']
    const validSortDir =
      (props.sort_dir && dirOps.includes(props.sort_dir.toLowerCase())) || false
    const orderByField = validSort ? props.sort : 'created_at'
    const orderByDir = validSortDir ? props.sort_dir : 'desc'
    const [users, total] = await this.toolsRepository.findAndCount({
      ...(props.filter && {
        where: {
          description: ILike(props.filter),
        },
      }),
      order: {
        [orderByField]: orderByDir,
      },
      skip: (props.page - 1) * props.per_page,
      take: props.per_page,
    })
    return {
      items: users,
      per_page: props.per_page,
      total,
      current_page: props.page,
      sort: props.sort,
      sort_dir: props.sort_dir,
      filter: props.filter,
    }
  }

  protected async _get(id: string): Promise<ToolsModel> {
    const tool = await this.toolsRepository.findOneBy({ id })

    if (!tool) {
      throw new NotFoundError(`Tool not found using ID ${id}`)
    }

    return tool
  }
}
