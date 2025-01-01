import { dataValidation } from '@/common/infrastructure/validation/zod'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'
import { UpdateStockMovementUseCase } from '@/stockMovements/application/usecases/update-stockMovement.usecase'

export async function UpdateStockMovementController(
  request: Request,
  response: Response,
) {
  const updateStockMovementSchemaParam = z.object({
    id: z.string(),
  })

  const { id } = dataValidation(updateStockMovementSchemaParam, request.params)

  const updateStockMovementSchemaBody = z.object({
    tool_id: z.string().optional(),
    supplier_id: z.string().optional(),
    user_id: z.string().optional(),
    quantity: z.number().positive().optional(),
    reason: z.string().optional(),
    movement_type: z.enum(['entrada', 'saída']).optional(),
  })

  const { tool_id, supplier_id, user_id, quantity, reason, movement_type } =
    dataValidation(updateStockMovementSchemaBody, request.body)

  container.resolve('StockMovementRepository')

  const updateStockMovementUseCase: UpdateStockMovementUseCase.UseCase =
    container.resolve('UpdateStockMovementUseCase')

  const updateStockMovement = await updateStockMovementUseCase.execute({
    id,
    tool_id,
    supplier_id,
    user_id,
    quantity,
    reason,
    movement_type,
  })

  response
    .status(200)
    .json([
      { updateStockMovement },
      { message: 'Movimentação de estoque atualizado com sucesso!' },
    ])
}
