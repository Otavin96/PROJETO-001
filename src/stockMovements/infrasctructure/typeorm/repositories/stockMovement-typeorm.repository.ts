import {
  SearchInput,
  SearchOutput,
} from '@/common/domain/repositories/repository.interface'
import { StockMovementModel } from '@/stockMovements/domain/models/stockMovements.model'
import { StockMovementRepository } from '@/stockMovements/repositories/stockMovements.repository'
import { inject, injectable } from 'tsyringe'
import { ILike, Repository } from 'typeorm'
import {
  MovementType,
  StockMovement,
} from '../entities/stockMovements.entities'
import { NotFoundError } from '@/common/domain/erros/not-found-error'

@injectable()
export class StockMovementTypeormRepository implements StockMovementRepository {
  sortableFields: string[] = ['reason', 'created_at']

  constructor(
    @inject('StockMovementDefaultTypeormRepository')
    private StockMovementRepository: Repository<StockMovement>,
  ) {}

  create(props: StockMovementModel): StockMovementModel {
    const entity = this.StockMovementRepository.create(props)
    return {
      ...entity,
      movement_type: entity.movement_type as 'entrada' | 'saída',
    } as StockMovementModel
  }

  async insert(model: StockMovementModel): Promise<StockMovementModel> {
    return this.StockMovementRepository.save(model)
  }

  async findById(id: string): Promise<StockMovementModel> {
    return this._get(id)
  }

  async getAllStockMovement(): Promise<StockMovementModel[]> {
    const allStockMovement = this.StockMovementRepository.find({
      relations: ['user_id', 'tool_id', 'supplier_id'],
    })

    if (!allStockMovement) {
      throw new NotFoundError('StockMovement not found')
    }

    return allStockMovement
  }

  async update(model: StockMovementModel): Promise<StockMovementModel> {
    await this._get(model.id)
    await this.StockMovementRepository.update({ id: model.id }, model)
    return model
  }

  async delete(id: string): Promise<void> {
    await this._get(id)
    await this.StockMovementRepository.delete(id)
  }

  async search(props: SearchInput): Promise<SearchOutput<StockMovementModel>> {
    const validSort = this.sortableFields.includes(props.sort) || false
    const dirOps = ['asc', 'desc']
    const validSortDir =
      (props.sort_dir && dirOps.includes(props.sort_dir.toLowerCase())) || false
    const orderByField = validSort ? props.sort : 'created_at'
    const orderByDir = validSortDir ? props.sort_dir : 'desc'
    const [stockMovements, total] =
      await this.StockMovementRepository.findAndCount({
        ...(props.filter && {
          where: {
            reason: ILike(props.filter),
          },
        }),
        order: {
          [orderByField]: orderByDir,
        },
        skip: (props.page - 1) * props.per_page,
        take: props.per_page,
      })
    return {
      items: stockMovements.map(movement => ({
        ...movement,
        movement_type: movement.movement_type as MovementType,
      })),
      per_page: props.per_page,
      total,
      current_page: props.page,
      sort: props.sort,
      sort_dir: props.sort_dir,
      filter: props.filter,
    }
  }

  protected async _get(id: string): Promise<StockMovementModel> {
    const stockMovement = await this.StockMovementRepository.findOne({
      where: { id },
      relations: ['user_id', 'tool_id', 'supplier_id'],
    })

    if (!stockMovement) {
      throw new NotFoundError(`StockMovement not found using ID ${id}`)
    }

    return stockMovement
  }
}
