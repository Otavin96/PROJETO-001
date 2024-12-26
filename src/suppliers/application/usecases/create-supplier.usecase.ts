import { inject, injectable } from 'tsyringe'
import { SupplierOutput } from '../dtos/supplier-output.dto'
import { SuppliersRepository } from '@/suppliers/repositories/suppliers.repository'
import { BadRequestError } from '@/common/domain/erros/bad-request-error'
export namespace CreateSupplierUseCase {
  export type Input = {
    name: string
    description: string
  }

  export type Output = SupplierOutput

  @injectable()
  export class UseCase {
    constructor(
      @inject('SupplierRepository')
      private suppliersRepository: SuppliersRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      if (!input.name || !input.description) {
        throw new BadRequestError('Input data not provided or invalid')
      }

      await this.suppliersRepository.conflictingName(input.name)

      const supplier = this.suppliersRepository.create(input)

      const CreatedSupplier: SupplierOutput =
        await this.suppliersRepository.insert(supplier)

      return CreatedSupplier
    }
  }
}
