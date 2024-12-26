import 'reflect-metadata'
import { SuppliersRepository } from '@/suppliers/repositories/suppliers.repository'
import { inject, injectable } from 'tsyringe'

export namespace DeleteSupplierUseCase {
  export type Input = {
    id: string
  }

  export type Output = void

  @injectable()
  export class UseCase {
    constructor(
      @inject('SupplierRepository')
      private supplierRepository: SuppliersRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      await this.supplierRepository.delete(input.id)
    }
  }
}
