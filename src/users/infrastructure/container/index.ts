import { dataSource } from '@/common/infrastructure/typeorm'
import { container } from 'tsyringe'
import { User } from '../typeorm/entities/users.entities'
import { UsersTypeormRepository } from '../typeorm/repositories/users-typeorm.repository'
import { CreateUsersUseCase } from '@/users/application/usecases/create-user.usecase'
import { GetUsersUseCase } from '@/users/application/usecases/get-user.usecase'
import { UpdateUserUseCase } from '@/users/application/usecases/update-user.usecase'
import { DeleteUserUseCase } from '@/users/application/usecases/delete-user.usecase'
import { SearchUserUseCase } from '@/users/application/usecases/search-user.usecase'

container.registerSingleton('UsersRepository', UsersTypeormRepository)

container.registerInstance(
  'UsersDefaultTypeormRepository',
  dataSource.getRepository(User),
)

container.registerSingleton('CreateUsersUseCase', CreateUsersUseCase.UseCase)

container.registerSingleton('GetUsersUseCase', GetUsersUseCase.UseCase)

container.registerSingleton('UpdateUsersUseCase', UpdateUserUseCase.UseCase)

container.registerSingleton('DeleteUsersUseCase', DeleteUserUseCase.UseCase)

container.registerSingleton('SearchUserUseCase', SearchUserUseCase.UseCase)
