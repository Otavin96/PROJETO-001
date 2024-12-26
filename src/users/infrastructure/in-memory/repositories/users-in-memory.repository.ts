import { ConflictError } from '@/common/domain/erros/conflict-error'
import { NotFoundError } from '@/common/domain/erros/not-found-error'
import { InMemoryRepository } from '@/common/domain/repositories/in-memory.repository'
import { UsersModel } from '@/users/domain/models/users.model'
import { UsersRepository } from '@/users/repositories/users.repository'

export class UsersInMemoryRepository
  extends InMemoryRepository<UsersModel>
  implements UsersRepository
{
  sortableFields: string[] = ['name', 'email', 'created_at']

  async findByEmail(email: string): Promise<UsersModel> {
    const user = this.items.find(item => item.email === email)

    if (!user) {
      throw new NotFoundError(`User not found using email ${email}`)
    }

    return user
  }

  async findByName(name: string): Promise<UsersModel> {
    const user = this.items.find(item => item.name === name)

    if (!user) {
      throw new NotFoundError(`User not found using name ${name}`)
    }

    return user
  }

  async conflictingEmail(email: string): Promise<void> {
    const user = this.items.find(item => item.email === email)

    if (user) {
      throw new ConflictError('Email already used on another user.')
    }
  }

  protected async applyFilter(
    items: UsersModel[],
    filter: string | null,
  ): Promise<UsersModel[]> {
    if (!filter) {
      return items
    }

    return items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase()),
    )
  }

  protected async applySort(
    items: UsersModel[],
    sort: string | null,
    sort_dir: string | null,
  ): Promise<UsersModel[]> {
    return super.applySort(items, sort ?? 'created_at', sort_dir ?? 'desc')
  }
}
