import { dataValidation } from '@/common/infrastructure/validation/zod'
import { z } from 'zod'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { GetStockMovementUseCase } from '@/stockMovements/application/usecases/get-stockMovement.usecase'

export async function GetStockMovementController(
  request: Request,
  response: Response,
) {
  //Criar uma const para armazenar a validação do ID que vem pelo Params
  const GetStockMovementSchemaParams = z.object({
    id: z.string(),
  })

  //Aqui chamamos o arquivo dataValidation para validar o ID que vem via Request
  const { id } = dataValidation(GetStockMovementSchemaParams, request.params)

  //Chamo a dependecia StockMovementRepository
  container.resolve('StockMovementRepository')

  //crio uma const para amarzenar a injeção de dependecia do meu GetStockMovementUseCase
  const getStockMovementUseCase: GetStockMovementUseCase.UseCase =
    container.resolve('GetStockMovementUseCase')

  const stockMovement = await getStockMovementUseCase.execute({ id })

  response
    .status(200)
    .json([
      { stockMovement },
      { message: 'Movimentação encontrada com sucesso!' },
    ])
}
