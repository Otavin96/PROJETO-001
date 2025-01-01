/* eslint-disable prettier/prettier */
import { StockMovement } from '@/stockMovements/infrasctructure/typeorm/entities/stockMovements.entities'
import { ToolsModel } from '@/tools/domain/models/tools.model'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('tools')
export class Tool {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  description: string

  @Column()
  type: string

  @Column('int')
  quantity: number

  @Column('int')
  stockMax: number

  @Column('int')
  stockMin: number

  @Column()
  status: string

  @OneToMany(() => StockMovement, stockMovement => stockMovement.tool_id)
  stockMovements: StockMovement[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
