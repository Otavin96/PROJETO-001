import { dataValidation } from '@/common/infrastructure/validation/zod'
import { CreateStockMovementUseCase } from '@/stockMovements/application/usecases/create-stockMovement.usecase'
import { container } from 'tsyringe'
import { z } from 'zod'
import { Request, Response } from 'express'

export async function createStockMovementController(
  request: Request,
  response: Response,
) {
  const createStockMovementSchemaBody = z.object({
    tool_id: z.string(),
    supplier_id: z.string(),
    user_id: z.string(),
    quantity: z.number().positive(),
    reason: z.string(),
    movement_type: z.enum(['entrada', 'saída']),
  })

  const { tool_id, supplier_id, user_id, quantity, reason, movement_type } =
    dataValidation(createStockMovementSchemaBody, request.body)

  container.resolve('StockMovementRepository')
  const createStockMovementUseCase: CreateStockMovementUseCase.UseCase =
    container.resolve('CreateStockMovementUseCase')

  const stockMovement = await createStockMovementUseCase.execute({
    tool_id,
    supplier_id,
    user_id,
    quantity,
    reason,
    movement_type,
  })

  response
    .status(201)
    .json([
      { stockMovement },
      { message: 'Movimentação de estoque concluida com sucesso!' },
    ])
}
