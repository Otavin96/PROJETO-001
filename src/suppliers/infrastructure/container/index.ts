import { container } from 'tsyringe'
import { dataSource } from '@/common/infrastructure/typeorm'
import { Supplier } from '../typeorm/entities/suppliers.entities'
import { SuppliersTypeormRepository } from '../typeorm/repositories/suppliers-typeorm.repository'
import { UpdateSupplierUseCase } from '@/suppliers/application/usecases/update-supplier.usecase'
import { DeleteSupplierUseCase } from '@/suppliers/application/usecases/delete-supplier.usecase'
import { SearchSupplierUseCase } from '@/suppliers/application/usecases/search-supplier.usecase'
import { GetSupplierUseCase } from '@/suppliers/application/usecases/get-supplier.usecase'
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

container.registerSingleton('GetSupplierUseCase', GetSupplierUseCase.UseCase)

container.registerSingleton(
  'UpdateSupplierUseCase',
  UpdateSupplierUseCase.UseCase,
)

container.registerSingleton(
  'DeleteSupplierUseCase',
  DeleteSupplierUseCase.UseCase,
)

container.registerSingleton(
  'SearchSupplierUseCase',
  SearchSupplierUseCase.UseCase,
)
