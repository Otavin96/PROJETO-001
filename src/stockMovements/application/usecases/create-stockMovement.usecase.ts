import { MovementType } from '@/stockMovements/domain/models/stockMovements.model'
import { Supplier } from '@/suppliers/infrastructure/typeorm/entities/suppliers.entities'
import { Tool } from '@/tools/infrastructure/typeorm/entities/tools.entities'
import { User } from '@/users/infrastructure/typeorm/entities/users.entities'
import { StockMovementOutput } from '../dtos/stockMovement-output.dto'
import { inject, injectable } from 'tsyringe'
import { StockMovementRepository } from '@/stockMovements/repositories/stockMovements.repository'
import { BadRequestError } from '@/common/domain/erros/bad-request-error'
import { ToolsRepository } from '@/tools/repositories/tools.repository'

export namespace CreateStockMovementUseCase {
  export type Input = {
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
      // Validação dos dados de entrada
      if (!input.tool_id || !input.supplier_id || !input.user_id) {
        throw new BadRequestError('Tool, Supplier, and User are required.')
      }
      if (input.quantity <= 0) {
        throw new BadRequestError('Quantity must be greater than zero.')
      }
      if (!['entrada', 'saída'].includes(input.movement_type)) {
        throw new BadRequestError('Invalid movement type.')
      }

      //Verifica qual tipo de movimentação se é de entrada ou saída
      if (input.movement_type === 'entrada') {
        const tool = await this.toolRepository.findById(
          input.tool_id as unknown as string,
        )

        tool.quantity = tool.quantity + input.quantity

        if (tool.quantity > tool.stockMax) {
          throw new BadRequestError(
            'Erro ao dar entrada na ferramenta! Quantidade maior do que o estoque maximo!',
          )
        }

        await this.toolRepository.update(tool)
      } else {
        const tool = await this.toolRepository.findById(
          input.tool_id as unknown as string,
        )

        tool.quantity = tool.quantity - input.quantity

        if (tool.quantity < tool.stockMin) {
          throw new BadRequestError(
            'Erro ao dar saída na ferramenta! Quantidade menor do que o estoque minimo!',
          )
        }

        await this.toolRepository.update(tool)
      }
      const StockMovement = this.stockMovementRepository.create(input)

      const CreatedStockMovement: StockMovementOutput =
        await this.stockMovementRepository.insert(StockMovement)

      return CreatedStockMovement
    }
  }
}
