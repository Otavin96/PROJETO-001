import { dataValidation } from '@/common/infrastructure/validation/zod'
import { CreateUsersUseCase } from '@/users/application/usecases/create-user.usecase'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'
export async function createUserController(
  request: Request,
  response: Response,
) {
  const createUserSchemaBody = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
  })

  const { name, email, password } = dataValidation(
    createUserSchemaBody,
    request.body,
  )

  const createUsersUseCase: CreateUsersUseCase.UseCase =
    container.resolve('CreateUsersUseCase')

  const user = await createUsersUseCase.execute({ name, email, password })

  response.status(201).json(user)
}
