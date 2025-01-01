import { inject, injectable } from 'tsyringe'
import { StockMovementOutput } from '../dtos/stockMovement-output.dto'
import { StockMovementRepository } from '@/stockMovements/repositories/stockMovements.repository'

export namespace GetAllStockMovementUseCase {
  export type Output = StockMovementOutput

  @injectable()
  export class UseCase {
    constructor(
      @inject('StockMovementRepository')
      private stockMovementRepository: StockMovementRepository,
    ) {}

    async execute(): Promise<StockMovementOutput[]> {
      return this.stockMovementRepository.getAllStockMovement()
    }
  }
}
