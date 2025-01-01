import { dataValidation } from '@/common/infrastructure/validation/zod'
import { CreateToolUseCase } from '@/tools/application/usecases/create-tool.usecase'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function createToolController(
  request: Request,
  response: Response,
) {
  const createToolBodySchema = z.object({
    description: z.string(),
    type: z.string(),
    quantity: z.number(),
    stockMin: z.number(),
    stockMax: z.number(),
    status: z.string(),
  })

  const { description, type, quantity, stockMin, stockMax, status } =
    dataValidation(createToolBodySchema, request.body)

  container.resolve('ToolRepository')
  const createToolUseCase: CreateToolUseCase.UseCase =
    container.resolve('CreateToolUseCase')

  const tool = await createToolUseCase.execute({
    description,
    type,
    quantity,
    stockMin,
    stockMax,
    status,
  })

  return response.status(201).json(tool)
}
