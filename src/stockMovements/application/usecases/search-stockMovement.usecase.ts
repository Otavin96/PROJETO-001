import { SearchInput } from '@/common/domain/repositories/repository.interface'
import { StockMovementModel } from '@/stockMovements/domain/models/stockMovements.model'
import { StockMovementRepository } from '@/stockMovements/repositories/stockMovements.repository'
import {
  PaginationOutputDto,
  PaginationOutputMapper,
} from '@/tools/application/dtos/pagination-output.dto'
import { inject, injectable } from 'tsyringe'

export namespace SearchStockMovementUseCase {
  export type Input = SearchInput

  export type Output = PaginationOutputDto<StockMovementModel>

  @injectable()
  export class UseCase {
    constructor(
      @inject('StockMovementRepository')
      private stockMovementRepository: StockMovementRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const searchResult = await this.stockMovementRepository.search(input)
      return PaginationOutputMapper.toOutput(searchResult.items, searchResult)
    }
  }
}
