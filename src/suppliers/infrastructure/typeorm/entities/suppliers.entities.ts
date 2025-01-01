import { StockMovement } from '@/stockMovements/infrasctructure/typeorm/entities/stockMovements.entities'
import { SuppliersModel } from '@/suppliers/domain/models/suppliers.model'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  description: string

  @Column({ nullable: true })
  contact_email: string

  @Column({ nullable: true })
  phone: string

  @Column()
  status: string

  @OneToMany(() => StockMovement, stockMovement => stockMovement.supplier_id)
  stockMovements: StockMovement[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
