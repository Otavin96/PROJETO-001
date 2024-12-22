import { dataValidation } from '@/common/infrastructure/validation/zod'
import { UpdateToolUseCase } from '@/tools/application/usecases/update-tool.usercase'
import { Request, Response } from 'express'
import { z } from 'zod'
import { container } from 'tsyringe'

export async function updateToolController(
  request: Request,
  response: Response,
) {
  const updateToolbodySchema = z.object({
    description: z.string().optional(),
    type: z.string().optional(),
    quantity: z.number().optional(),
    stockMin: z.number().optional(),
    stockMax: z.number().optional(),
  })

  const { description, type, quantity, stockMin, stockMax } = dataValidation(
    updateToolbodySchema,
    request.body,
  )

  const updateToolParamSchmema = z.object({
    id: z.string(),
  })

  const { id } = dataValidation(updateToolParamSchmema, request.params)

  const updateToolUseCase: UpdateToolUseCase.UseCase =
    container.resolve('UpdateToolUseCase')

  const tool = await updateToolUseCase.execute({
    id,
    description,
    type,
    quantity,
    stockMin,
    stockMax,
  })

  return response.status(201).json(tool)
}
