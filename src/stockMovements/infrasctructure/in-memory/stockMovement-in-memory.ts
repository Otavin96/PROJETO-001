import { InMemoryRepository } from '@/common/domain/repositories/in-memory.repository'
import { StockMovementModel } from '@/stockMovements/domain/models/stockMovements.model'
import { StockMovementRepository } from '@/stockMovements/repositories/stockMovements.repository'

export class StockMovementInMemoryRepository
  extends InMemoryRepository<StockMovementModel>
  implements StockMovementRepository
{
  sortableFields: string[] = ['reason', 'movement_type']

  async getAllStockMovement(): Promise<StockMovementModel[]> {
    return this.items
  }

  protected async applyFilter(
    items: StockMovementModel[],
    filter: string | null,
  ): Promise<StockMovementModel[]> {
    if (!filter) {
      return items
    }

    return items.filter(item =>
      item.reason.toLowerCase().includes(filter.toLowerCase()),
    )
  }

  protected async applySort(
    items: StockMovementModel[],
    sort: string | null,
    sort_dir: string | null,
  ): Promise<StockMovementModel[]> {
    return super.applySort(items, sort ?? 'created_at', sort_dir ?? 'desc')
  }
}
