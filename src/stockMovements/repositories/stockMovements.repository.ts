import { Supplier } from '@/suppliers/infrastructure/typeorm/entities/suppliers.entities'
import { Tool } from '@/tools/infrastructure/typeorm/entities/tools.entities'
import { User } from '@/users/infrastructure/typeorm/entities/users.entities'
import {
  MovementType,
  StockMovementModel,
} from '../domain/models/stockMovements.model'
import { RepositoryInterface } from '@/common/domain/repositories/repository.interface'

export type CreateStockMovement = {
  tool_id: Tool
  supplier_id: Supplier
  user_id: User
  quantity: number
  reason: string
  movement_type: MovementType
}

export interface StockMovementRepository
  extends RepositoryInterface<StockMovementModel, CreateStockMovement> {
  getAllStockMovement(): Promise<StockMovementModel[]>
}
