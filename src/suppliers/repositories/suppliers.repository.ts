import { RepositoryInterface } from '@/common/domain/repositories/repository.interface'
import { SuppliersModel } from '../domain/models/suppliers.model'

export type SupplierId = {
  id: string
}

export type CreateSupplierProps = {
  id?: string
  name: string
  description: string
  created_at?: Date
  updated_at?: Date
}

export interface SuppliersRepository
  extends RepositoryInterface<SuppliersModel, CreateSupplierProps> {
  findByName(name: string): Promise<SuppliersModel>
  findByAllIds(suppliersIds: SupplierId[]): Promise<SuppliersModel[]>
  conflictingName(name: string): Promise<void>
}
