import { inject, injectable } from 'tsyringe'
import { SupplierOutput } from '../dtos/supplier-output.dto'
import { SuppliersRepository } from '@/suppliers/repositories/suppliers.repository'

export namespace UpdateSupplierUseCase {
  export type Input = {
    id: string
    name?: string
    description?: string
  }

  export type Output = SupplierOutput

  @injectable()
  export class UseCase {
    constructor(
      @inject('SupplierRepository')
      private supplierRepository: SuppliersRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const supplier = await this.supplierRepository.findById(input.id)

      if (input.name) {
        supplier.name = input.name
      }

      if (input.description) {
        supplier.description = input.description
      }

      const UpdateSupplier: SupplierOutput =
        await this.supplierRepository.update(supplier)

      return UpdateSupplier
    }
  }
}
