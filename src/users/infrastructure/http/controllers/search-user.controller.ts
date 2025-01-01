import { dataValidation } from '@/common/infrastructure/validation/zod'
import { SearchUserUseCase } from '@/users/application/usecases/search-user.usecase'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function SearchUserController(
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

  const searchUserUseCase: SearchUserUseCase.UseCase =
    container.resolve('SearchUserUseCase')

  const users = await searchUserUseCase.execute({
    page: page ?? 1,
    per_page: per_page ?? 15,
    sort: sort ?? null,
    sort_dir: sort_dir ?? null,
    filter: filter ?? null,
  })

  return response.status(201).json(users)
}