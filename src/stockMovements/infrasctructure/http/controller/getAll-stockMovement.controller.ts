import { GetAllStockMovementUseCase } from '@/stockMovements/application/usecases/getAll-stockMovement.usecase'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

export async function GetAllStockMovementController(
  request: Request,
  response: Response,
) {
  container.resolve('StockMovementRepository')

  const getAllStockMovementUseCase: GetAllStockMovementUseCase.UseCase =
    container.resolve('GetAllStockMovementUseCase')

  const getAllStockMovement = await getAllStockMovementUseCase.execute()

  response
    .status(200)
    .json([
      { getAllStockMovement },
      { message: 'Todas as movimentações listada com sucesso!' },
    ])
}
