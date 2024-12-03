/* eslint-disable prettier/prettier */
import { ToolsModel } from '@/tools/domain/models/tools.model'
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('tools')
export class Tool implements ToolsModel {
  @PrimaryGeneratedColumn('uuid')
  id: string
  @Column('varchar')
  description: string
  @Column('varchar')
  type: string
  @Column('int')
  quantity: number
  @Column('int')
  stockMax: number
  @Column('int')
  stockMin: number
  @CreateDateColumn('created_at')
  created_at: Date
  @CreateDateColumn('updated_at')
  updated_at: Date
}
