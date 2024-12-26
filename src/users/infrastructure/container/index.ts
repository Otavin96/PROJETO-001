import { dataSource } from '@/common/infrastructure/typeorm'
import { container } from 'tsyringe'
import { User } from '../typeorm/entities/users.entities'
import { UsersTypeormRepository } from '../typeorm/repositories/users-typeorm.repository'

container.registerSingleton('UsersRepository', UsersTypeormRepository)
container.registerInstance(
  'UsersDefaultTypeormRepository',
  dataSource.getRepository(User),
)
