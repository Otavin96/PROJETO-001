import { dataValidation } from '@/common/infrastructure/validation/zod'
import { DeleteStockMovementUseCase } from '@/stockMovements/application/usecases/delete-stockMovement.usecase'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function DeleteStockMovementController(
  request: Request,
  response: Response,
) {
  const deleteStockMovementSchemaParams = z.object({
    id: z.string(),
  })

  const { id } = dataValidation(deleteStockMovementSchemaParams, request.params)

  container.resolve('StockMovementRepository')

  const deleteStockMovementUseCase: DeleteStockMovementUseCase.UseCase =
    container.resolve('DeleteStockMovementUseCase')

  await deleteStockMovementUseCase.execute({ id })

  response
    .status(200)
    .json({ message: 'Movimentação de Estoque excluída com sucesso!' })
}
