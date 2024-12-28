import { dataValidation } from '@/common/infrastructure/validation/zod'
import { GetUsersUseCase } from '@/users/application/usecases/get-user.usecase'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function getUserController(request: Request, response: Response) {
  const GetUserSchemaParams = z.object({
    id: z.string(),
  })

  const { id } = dataValidation(GetUserSchemaParams, request.params)

  const getUserUseCase: GetUsersUseCase.UseCase =
    container.resolve('GetUsersUseCase')

  const user = await getUserUseCase.execute({ id })

  response.status(200).json(user)
}
