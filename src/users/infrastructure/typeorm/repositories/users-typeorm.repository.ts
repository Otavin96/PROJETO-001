import { ConflictError } from '@/common/domain/erros/conflict-error'
import { NotFoundError } from '@/common/domain/erros/not-found-error'
import { UnauthorizedError } from '@/common/domain/erros/unauthorized-error'
import {
  SearchInput,
  SearchOutput,
} from '@/common/domain/repositories/repository.interface'
import { UsersModel } from '@/users/domain/models/users.model'
import {
  CreateUsersProps,
  UsersRepository,
} from '@/users/repositories/users.repository'
import { compare } from 'bcrypt'
import { inject, injectable } from 'tsyringe'
import { ILike, Repository } from 'typeorm'

@injectable()
export class UsersTypeormRepository implements UsersRepository {
  sortableFields: string[] = ['name', 'created_at']

  constructor(
    @inject('UsersDefaultTypeormRepository')
    private usersRepository: Repository<UsersModel>,
  ) {}

  async findByEmail(email: string): Promise<UsersModel> {
    const user = await this.usersRepository.findOneBy({ email })

    if (!user) {
      throw new NotFoundError(`User not found using email ${email}`)
    }

    return user
  }

  async findByName(name: string): Promise<UsersModel> {
    const user = await this.usersRepository.findOneBy({ name })

    if (!user) {
      throw new NotFoundError(`User not found using name ${name}`)
    }

    return user
  }

  async conflictingEmail(email: string): Promise<void> {
    const user = await this.usersRepository.findOneBy({ email })

    if (user) {
      throw new ConflictError('Email already used on another user')
    }
  }

  async session(email: string, password: string): Promise<UsersModel> {
    const user = await this.findByEmail(email)

    if (!user) {
      throw new UnauthorizedError('Incorrect email/password')
    }

    const passwordConfirmed = await compare(password, user.password)

    if (!passwordConfirmed) {
      throw new UnauthorizedError('Incorrect email/password')
    }

    return user
  }

  create(props: CreateUsersProps): UsersModel {
    return this.usersRepository.create(props)
  }

  async insert(model: UsersModel): Promise<UsersModel> {
    return this.usersRepository.save(model)
  }

  async findById(id: string): Promise<UsersModel> {
    return this._get(id)
  }

  async update(model: UsersModel): Promise<UsersModel> {
    await this._get(model.id)
    await this.usersRepository.update({ id: model.id }, model)
    return model
  }

  async delete(id: string): Promise<void> {
    await this._get(id)
    await this.usersRepository.delete(id)
  }

  async search(props: SearchInput): Promise<SearchOutput<UsersModel>> {
    const validSort = this.sortableFields.includes(props.sort) || false
    const dirOps = ['asc', 'desc']
    const validSortDir =
      (props.sort_dir && dirOps.includes(props.sort_dir.toLowerCase())) || false
    const orderByField = validSort ? props.sort : 'created_at'
    const orderByDir = validSortDir ? props.sort_dir : 'desc'
    const [users, total] = await this.usersRepository.findAndCount({
      ...(props.filter && {
        where: {
          name: ILike(props.filter),
        },
      }),
      order: {
        [orderByField]: orderByDir,
      },
      skip: (props.page - 1) * props.per_page,
      take: props.per_page,
    })
    return {
      items: users,
      per_page: props.per_page,
      total,
      current_page: props.page,
      sort: props.sort,
      sort_dir: props.sort_dir,
      filter: props.filter,
    }
  }

  protected async _get(id: string): Promise<UsersModel> {
    const user = await this.usersRepository.findOneBy({ id })

    if (!user) {
      throw new NotFoundError(`User not found using ID ${id}`)
    }

    return user
  }
}
