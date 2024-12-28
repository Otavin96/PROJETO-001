import { dataValidation } from '@/common/infrastructure/validation/zod'
import { CreateUsersUseCase } from '@/users/application/usecases/create-user.usecase'
import { hash } from 'bcrypt'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function createUserController(
  request: Request,
  response: Response,
) {
  // Validação do corpo da requisição
  const createUserSchemaBody = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
  })

  const { name, email, password } = dataValidation(
    createUserSchemaBody,
    request.body,
  )

  // Hash da senha
  const hashedPassword = await hash(password, 10)

  // Injeção de dependência
  const createUsersUseCase: CreateUsersUseCase.UseCase =
    container.resolve('CreateUsersUseCase')

  // Execução do caso de uso e resposta
  const user = await createUsersUseCase.execute({ name, email, password: hashedPassword })

  response.status(201).json(user)
}
