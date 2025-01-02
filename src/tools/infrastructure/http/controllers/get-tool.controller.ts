import { dataValidation } from '@/common/infrastructure/validation/zod'
import { GetToolUseCase } from '@/tools/application/usecases/get-tool.usecase'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function getToolController(request: Request, response: Response) {
  const getToolParamSchema = z.object({
    id: z.string(),
  })

  console.log(request.user.id)

  const { id } = dataValidation(getToolParamSchema, request.params)

  const getToolUseCase: GetToolUseCase.UseCase =
    container.resolve('GetToolUseCase')

  const tool = await getToolUseCase.execute({ id })

  return response.status(200).json(tool)
}
