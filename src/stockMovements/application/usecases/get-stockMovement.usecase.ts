import { injectable, inject } from 'tsyringe'
import { StockMovementOutput } from '../dtos/stockMovement-output.dto'
import { StockMovementRepository } from '@/stockMovements/repositories/stockMovements.repository'

export namespace GetStockMovementUseCase {
  export type Input = {
    id: string
  }

  export type Output = StockMovementOutput

  @injectable()
  export class UseCase {
    constructor(
      @inject('StockMovementRepository')
      private stockMovementRepository: StockMovementRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const stockMovement = await this.stockMovementRepository.findById(
        input.id,
      )

      return stockMovement
    }
  }
}
