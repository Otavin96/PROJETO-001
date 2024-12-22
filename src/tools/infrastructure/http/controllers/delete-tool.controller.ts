import { dataValidation } from '@/common/infrastructure/validation/zod'
import { DeleteToolUseCase } from '@/tools/application/usecases/delete-tool.usecase'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function DeleteToolController(
  request: Request,
  response: Response,
) {
  const deleteToolBodySchema = z.object({
    id: z.string(),
  })

  const { id } = dataValidation(deleteToolBodySchema, request.params)

  container.resolve('ToolRepository')
  const deleteToolUseCase: DeleteToolUseCase.UseCase =
    container.resolve('DeleteToolUseCase')

  const tool = await deleteToolUseCase.execute({ id })

  return response.status(201).json(tool)
}
