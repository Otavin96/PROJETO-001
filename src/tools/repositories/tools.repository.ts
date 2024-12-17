import { RepositoryInterface } from '@/common/domain/repositories/repository.interface'
import { ToolsModel } from '../domain/models/tools.model'

export type ToolId = {
  id: string
}

export type CreateToolProps = {
  id?: string
  description: string
  type: string
  quantity: number
  stockMax: number
  stockMin: number
  created_at?: Date
  updated_at?: Date
}

export interface ToolsRepository
  extends RepositoryInterface<ToolsModel, CreateToolProps> {
  findByDescription(description: string): Promise<ToolsModel>
  findAllByIds(toolIds: ToolId[]): Promise<ToolsModel[]>
  confinctingDescription(description: string): Promise<void>
}
