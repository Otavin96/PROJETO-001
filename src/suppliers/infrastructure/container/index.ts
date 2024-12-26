import { container } from 'tsyringe'
import { dataSource } from '@/common/infrastructure/typeorm'
import { Supplier } from '../typeorm/entities/suppliers.entities'
import { SuppliersTypeormRepository } from '../typeorm/repositories/suppliers-typeorm.repository'

container.registerSingleton('SupplierRepository', SuppliersTypeormRepository)

container.registerInstance(
  'SuppliersDefaultTypeormRepository',
  dataSource.getRepository(Supplier),
)
