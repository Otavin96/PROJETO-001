import 'reflect-metadata'
import { SearchInput } from '@/common/domain/repositories/repository.interface'
import { SuppliersModel } from '@/suppliers/domain/models/suppliers.model'
import { SuppliersRepository } from '@/suppliers/repositories/suppliers.repository'
import {
  PaginationOutputDto,
  PaginationOutputMapper,
} from '@/tools/application/dtos/pagination-output.dto'
import { inject, injectable } from 'tsyringe'

export namespace SearchSupplierUseCase {
  export type Input = SearchInput

  export type Output = PaginationOutputDto<SuppliersModel>

  @injectable()
  export class UseCase {
    constructor(
      @inject('SupplierRepository')
      private suppliersRepository: SuppliersRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const searchResult = await this.suppliersRepository.search(input)
      return PaginationOutputMapper.toOutput(searchResult.items, searchResult)
    }
  }
}
