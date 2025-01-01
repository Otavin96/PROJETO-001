import {
  Column,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '@/users/infrastructure/typeorm/entities/users.entities'
import { Tool } from '@/tools/infrastructure/typeorm/entities/tools.entities'
import { Supplier } from '@/suppliers/infrastructure/typeorm/entities/suppliers.entities'

// Enum definido no domínio
export enum MovementType {
  ENTRADA = 'entrada',
  SAIDA = 'saída',
}

@Entity('stock_movements')
export class StockMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('int')
  quantity: number

  @Column('text')
  reason: string

  @Column({ type: 'enum', enum: MovementType })
  movement_type: MovementType

  @ManyToOne(() => User, user => user.stockMovements, { nullable: true })
  user_id: User

  @ManyToOne(() => Tool, tool => tool.stockMovements, { nullable: false })
  tool_id: Tool

  @ManyToOne(() => Supplier, supplier => supplier.stockMovements, {
    nullable: true,
  })
  supplier_id: Supplier

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
