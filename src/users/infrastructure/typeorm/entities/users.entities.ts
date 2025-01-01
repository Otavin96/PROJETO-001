import { StockMovement } from '@/stockMovements/infrasctructure/typeorm/entities/stockMovements.entities'
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  password: string

  @Column({ nullable: true })
  avatar?: string

  @OneToMany(() => StockMovement, stockMovement => stockMovement.user_id)
  stockMovements: StockMovement[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
