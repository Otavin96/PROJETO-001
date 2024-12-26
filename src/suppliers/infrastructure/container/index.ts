import { container } from 'tsyringe'
import { dataSource } from '@/common/infrastructure/typeorm'
import { Supplier } from '../typeorm/entities/suppliers.entities'
import { SuppliersTypeormRepository } from '../typeorm/repositories/suppliers-typeorm.repository'
import { CreateSupplierUseCase } from '@/suppliers/application/usecases/create-supplier.usecase'

container.registerSingleton('SupplierRepository', SuppliersTypeormRepository)

container.registerInstance(
  'SuppliersDefaultTypeormRepository',
  dataSource.getRepository(Supplier),
)

container.registerSingleton(
  'CreateSupplierUseCase',
  CreateSupplierUseCase.UseCase,
)
