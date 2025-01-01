import { RepositoryInterface } from '@/common/domain/repositories/repository.interface'
import { UsersModel } from '../domain/models/users.model'

export type CreateUsersProps = {
  name: string
  email: string
  password: string
}

export interface UsersRepository
  extends RepositoryInterface<UsersModel, CreateUsersProps> {
  findByEmail(email: string): Promise<UsersModel>
  findByName(name: string): Promise<UsersModel>
  conflictingEmail(email: string): Promise<void>
  session(email: string, password: string): Promise<UsersModel>
}
