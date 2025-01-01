import { dataSource } from '@/common/infrastructure/typeorm'
import { container } from 'tsyringe'
import { StockMovement } from '../typeorm/entities/stockMovements.entities'
import { StockMovementTypeormRepository } from '../typeorm/repositories/stockMovement-typeorm.repository'
import { CreateStockMovementUseCase } from '@/stockMovements/application/usecases/create-stockMovement.usecase'
import { GetStockMovementUseCase } from '@/stockMovements/application/usecases/get-stockMovement.usecase'
import { GetAllStockMovementUseCase } from '@/stockMovements/application/usecases/getAll-stockMovement.usecase'
import { UpdateStockMovementUseCase } from '@/stockMovements/application/usecases/update-stockMovement.usecase'
import { DeleteStockMovementUseCase } from '@/stockMovements/application/usecases/delete-stockMovement.usecase'
import { SearchStockMovementUseCase } from '@/stockMovements/application/usecases/search-stockMovement.usecase'

container.registerSingleton(
  'StockMovementRepository',
  StockMovementTypeormRepository,
)

container.registerInstance(
  'StockMovementDefaultTypeormRepository',
  dataSource.getRepository(StockMovement),
)

container.registerSingleton(
  'CreateStockMovementUseCase',
  CreateStockMovementUseCase.UseCase,
)

container.registerSingleton(
  'GetStockMovementUseCase',
  GetStockMovementUseCase.UseCase,
)

container.registerSingleton(
  'GetAllStockMovementUseCase',
  GetAllStockMovementUseCase.UseCase,
)

container.registerSingleton(
  'UpdateStockMovementUseCase',
  UpdateStockMovementUseCase.UseCase,
)

container.registerSingleton(
  'DeleteStockMovementUseCase',
  DeleteStockMovementUseCase.UseCase,
)

container.registerSingleton(
  'SearchStockMovementUseCase',
  SearchStockMovementUseCase.UseCase,
)
