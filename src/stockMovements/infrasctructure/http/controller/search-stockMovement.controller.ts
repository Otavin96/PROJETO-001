import { dataValidation } from '@/common/infrastructure/validation/zod'
import { Request, Response } from 'express'
import { z } from 'zod'
import { container } from 'tsyringe'
import { SearchStockMovementUseCase } from '@/stockMovements/application/usecases/search-stockMovement.usecase'

export async function SearchStockMovementController(
  request: Request,
  response: Response,
): Promise<Response> {
  const querySchema = z.object({
    page: z.coerce.number().optional(),
    per_page: z.coerce.number().optional(),
    sort: z.coerce.string().optional(),
    sort_dir: z.coerce.string().optional(),
    filter: z.coerce.string().optional(),
  })

  const { page, per_page, sort, sort_dir, filter } = dataValidation(
    querySchema,
    request.query,
  )

  const searchStockMovementUseCase: SearchStockMovementUseCase.UseCase =
    container.resolve('SearchStockMovementUseCase')

  const stockMovement = await searchStockMovementUseCase.execute({
    page: page ?? 1,
    per_page: per_page ?? 15,
    sort: sort ?? null,
    sort_dir: sort_dir ?? null,
    filter: filter ?? null,
  })

  return response.status(200).json(stockMovement)
}
