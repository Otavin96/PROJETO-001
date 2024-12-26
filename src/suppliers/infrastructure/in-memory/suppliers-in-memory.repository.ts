import { ConflictError } from '@/common/domain/erros/conflict-error'
import { NotFoundError } from '@/common/domain/erros/not-found-error'
import { InMemoryRepository } from '@/common/domain/repositories/in-memory.repository'
import { SuppliersModel } from '@/suppliers/domain/models/suppliers.model'
import {
  SupplierId,
  SuppliersRepository,
} from '@/suppliers/repositories/suppliers.repository'

export class SuppliersInMemoryRepository
  extends InMemoryRepository<SuppliersModel>
  implements SuppliersRepository
{
  sortableFields: string[] = ['name', 'created_at']

  async findByName(name: string): Promise<SuppliersModel> {
    const supplier = this.items.find(item => item.name === name)

    if (!supplier) {
      throw new NotFoundError(`Supplier not found using name ${name}`)
    }

    return supplier
  }

  async findByAllIds(suppliersIds: SupplierId[]): Promise<SuppliersModel[]> {
    const existingSupplier = []
    for (const supplierId of suppliersIds) {
      const supplier = this.items.find(item => item.id === supplierId.id)

      if (supplier) {
        existingSupplier.push(supplier)
      }

      return existingSupplier
    }
  }

  async conflictingName(name: string): Promise<void> {
    const supplier = this.items.find(item => item.name === name)

    if (supplier) {
      throw new ConflictError('Name already used on another supplier')
    }
  }

  protected async applyFilter(
    items: SuppliersModel[],
    filter: string | null,
  ): Promise<SuppliersModel[]> {
    if (!filter) return items
    return items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase()),
    )
  }

  protected async applySort(
    items: SuppliersModel[],
    sort: string | null,
    sort_dir: string | null,
  ): Promise<SuppliersModel[]> {
    return super.applySort(items, sort ?? 'created_at', sort_dir ?? 'desc')
  }
}
