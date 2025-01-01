import { injectable, inject } from 'tsyringe'
import { StockMovementOutput } from '../dtos/stockMovement-output.dto'
import { StockMovementRepository } from '@/stockMovements/repositories/stockMovements.repository'

export namespace DeleteStockMovementUseCase {
  export type Input = {
    id: string
  }

  export type Output = void

  @injectable()
  export class UseCase {
    constructor(
      @inject('StockMovementRepository')
      private stockMovementRepository: StockMovementRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      return this.stockMovementRepository.delete(input.id)
    }
  }
}
