import { Supplier } from '@/suppliers/infrastructure/typeorm/entities/suppliers.entities'
import { Tool } from '@/tools/infrastructure/typeorm/entities/tools.entities'
import { User } from '@/users/infrastructure/typeorm/entities/users.entities'

export enum MovementType {
  ENTRADA = 'entrada',
  SAIDA = 'saída',
}

export interface StockMovementModel {
  id: string
  tool_id: Tool
  supplier_id: Supplier
  user_id: User
  quantity: number
  reason: string
  movement_type: MovementType
  created_at: Date
  updated_at: Date
}
