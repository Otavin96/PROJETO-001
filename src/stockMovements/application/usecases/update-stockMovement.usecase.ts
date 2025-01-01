import { inject, injectable } from 'tsyringe'
import { StockMovementOutput } from '../dtos/stockMovement-output.dto'
import { StockMovementRepository } from '@/stockMovements/repositories/stockMovements.repository'
import { Tool } from '@/tools/infrastructure/typeorm/entities/tools.entities'
import { Supplier } from '@/suppliers/infrastructure/typeorm/entities/suppliers.entities'
import { User } from '@/users/infrastructure/typeorm/entities/users.entities'
import { MovementType } from '@/stockMovements/domain/models/stockMovements.model'
import { ToolsRepository } from '@/tools/repositories/tools.repository'

export namespace UpdateStockMovementUseCase {
  export type Input = {
    id: string
    tool_id: Tool
    supplier_id: Supplier
    user_id: User
    quantity: number
    reason: string
    movement_type: MovementType
  }

  export type Output = StockMovementOutput

  @injectable()
  export class UseCase {
    constructor(
      @inject('StockMovementRepository')
      private stockMovementRepository: StockMovementRepository,
      @inject('ToolRepository')
      private toolRepository: ToolsRepository,
    ) {}
    async execute(input: Input): Promise<Output> {
      const stockMovement = await this.stockMovementRepository.findById(
        input.id,
      )

      const tool = await this.toolRepository.findById(stockMovement.tool_id.id)

      if (input.tool_id) {
        stockMovement.tool_id = input.tool_id
      }

      if (input.supplier_id) {
        stockMovement.supplier_id = input.supplier_id
      }

      if (input.user_id) {
        stockMovement.user_id = input.user_id
      }

      if (input.quantity) {
        //Verifica o tipo de movimentação
        //Caso o tipo de movimentação for saída entrará nesse bloco  de codigo
        if (stockMovement.movement_type === 'saída') {
          //Faz a verificação se o valor de atualização é menor do que esta no banco
          if (input.quantity < stockMovement.quantity) {
            const newQuantity = stockMovement.quantity - input.quantity

            tool.quantity = tool.quantity + newQuantity
          } else {
            const newQuantity = input.quantity - stockMovement.quantity

            tool.quantity = tool.quantity - newQuantity
          }

          await this.toolRepository.update(tool)
        }

        console.log('Tipo: ' + stockMovement.movement_type)

        if (stockMovement.movement_type === 'entrada') {
          //Se for outro tipo entra no esle. OBS: É possivel somente dois tipos de movimentação entrada e saída
          console.log('estou aqui')
          if (input.quantity < stockMovement.quantity) {
            // 3                 5
            const newQuantity = stockMovement.quantity - input.quantity
            console.log('estou aqui 2')

            tool.quantity = tool.quantity - newQuantity
          } else {
            console.log('estou aqui 3')
            const newQuantity = input.quantity - stockMovement.quantity

            tool.quantity = tool.quantity + newQuantity
          }

          await this.toolRepository.update(tool)
        }

        stockMovement.quantity = input.quantity
      }

      if (input.reason) {
        stockMovement.reason = input.reason
      }

      if (input.movement_type) {
        stockMovement.movement_type = input.movement_type
      }

      const UpdateStockMovement =
        await this.stockMovementRepository.update(stockMovement)

      return UpdateStockMovement
    }
  }
}
