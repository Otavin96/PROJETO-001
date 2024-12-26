import 'reflect-metadata'
import { injectable, inject } from 'tsyringe'
import { SupplierOutput } from '../dtos/supplier-output.dto'
import { SuppliersRepository } from '@/suppliers/repositories/suppliers.repository'

export namespace GetSupplierUseCase {
  export type Input = {
    id: string
  }

  export type Output = SupplierOutput

  @injectable()
  export class UseCase {
    constructor(
      @inject('SupplierRepository')
      private suppliersRepository: SuppliersRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const supplier = await this.suppliersRepository.findById(input.id)

      return supplier
    }
  }
}
