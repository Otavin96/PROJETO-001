import { dataValidation } from '@/common/infrastructure/validation/zod'
import { Request, Response } from 'express'
import { z } from 'zod'
import { container } from 'tsyringe'
import { UpdateUserUseCase } from '@/users/application/usecases/update-user.usecase'
export async function UpdateUserController(
  request: Request,
  response: Response,
) {
  const UpdateUserSchemaParams = z.object({
    id: z.string(),
  })

  const { id } = dataValidation(UpdateUserSchemaParams, request.params)

  const UpdateUserSchemaBody = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    password: z.string().optional(),
    avatar: z.string().optional(),
  })

  const { name, email, password, avatar } = dataValidation(
    UpdateUserSchemaBody,
    request.body,
  )

  const updateUserUseCase: UpdateUserUseCase.UseCase =
    container.resolve('UpdateUsersUseCase')

  const user = await updateUserUseCase.execute({
    id,
    name,
    email,
    password,
    avatar,
  })

  response.status(200).json(user)
}
