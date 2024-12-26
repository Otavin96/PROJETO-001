import { ConflictError } from '@/common/domain/erros/conflict-error'
import { NotFoundError } from '@/common/domain/erros/not-found-error'
import {
  SearchInput,
  SearchOutput,
} from '@/common/domain/repositories/repository.interface'
import { SuppliersModel } from '@/suppliers/domain/models/suppliers.model'
import {
  CreateSupplierProps,
  SupplierId,
  SuppliersRepository,
} from '@/suppliers/repositories/suppliers.repository'
import { inject, injectable } from 'tsyringe'
import { ILike, In, Repository } from 'typeorm'

@injectable()
export class SuppliersTypeormRepository implements SuppliersRepository {
  sortableFields: string[] = ['name', 'created_at']

  constructor(
    @inject('SuppliersDefaultTypeormRepository')
    private suppliersRepository: Repository<SuppliersModel>,
  ) {}

  async findByName(name: string): Promise<SuppliersModel> {
    const supplier = await this.suppliersRepository.findOneBy({ name })

    if (!supplier) {
      throw new NotFoundError(`Supplier not found using name ${name}`)
    }

    return supplier
  }

  async findByAllIds(suppliersIds: SupplierId[]): Promise<SuppliersModel[]> {
    const ids = suppliersIds.map(supplierId => supplierId.id)

    const suppliersFound = await this.suppliersRepository.find({
      where: { id: In(ids) },
    })

    return suppliersFound
  }

  async conflictingName(name: string): Promise<void> {
    const supplier = await this.suppliersRepository.findOneBy({ name })

    if (supplier) {
      throw new ConflictError('Name already used on another supplier')
    }
  }

  create(props: CreateSupplierProps): SuppliersModel {
    return this.suppliersRepository.create(props)
  }

  async insert(model: SuppliersModel): Promise<SuppliersModel> {
    return this.suppliersRepository.save(model)
  }

  async findById(id: string): Promise<SuppliersModel> {
    return this._get(id)
  }

  async update(model: SuppliersModel): Promise<SuppliersModel> {
    await this._get(model.id)
    await this.suppliersRepository.update({ id: model.id }, model)

    return model
  }

  async delete(id: string): Promise<void> {
    await this._get(id)
    await this.suppliersRepository.delete(id)
  }

  async search(props: SearchInput): Promise<SearchOutput<SuppliersModel>> {
    const validSort = this.sortableFields.includes(props.sort) || false
    const dirOps = ['asc', 'desc']
    const validSortDir =
      (props.sort_dir && dirOps.includes(props.sort_dir.toLowerCase())) || false
    const orderByField = validSort ? props.sort : 'created_at'
    const orderByDir = validSortDir ? props.sort_dir : 'desc'
    const [suppliers, total] = await this.suppliersRepository.findAndCount({
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
      items: suppliers,
      per_page: props.per_page,
      total,
      current_page: props.page,
      sort: props.sort,
      sort_dir: props.sort_dir,
      filter: props.filter,
    }
  }

  protected async _get(id: string): Promise<SuppliersModel> {
    const supplier = await this.suppliersRepository.findOneBy({ id })

    if (!supplier) {
      throw new NotFoundError(`Supplier not found using ID ${id}`)
    }

    return supplier
  }

}
