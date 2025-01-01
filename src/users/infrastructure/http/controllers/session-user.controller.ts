import { dataValidation } from '@/common/infrastructure/validation/zod'
import { container } from 'tsyringe'
import { z } from 'zod'
import { Request, Response } from 'express'
import { SessionUsersUseCase } from '@/users/application/usecases/session-user.usecase'

export async function sessionUserController(
  request: Request,
  response: Response,
) {
  // Validação do corpo da requisição
  const createUserSchemaBody = z.object({
    email: z.string(),
    password: z.string(),
  })

  const { email, password } = dataValidation(createUserSchemaBody, request.body)

  container.resolve('UsersRepository')
  // Injeção de dependência
  const sessionUsersUseCase: SessionUsersUseCase.UseCase = container.resolve(
    'SessionUsersUseCase',
  )

  // Execução do caso de uso e resposta
  const user = await sessionUsersUseCase.execute({
    email,
    password,
  })

  response
    .status(201)
    .json([
      { user },
      { message: `Usuário logado com sucesso! Seja bem vindo: ${user.name}` },
    ])
}
