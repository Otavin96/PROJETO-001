import { dataValidation } from "@/common/infrastructure/validation/zod";
import { SearchToolUseCase } from "@/tools/application/usecases/search-tool.usecase";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

export async function SearchToolController(request: Request, response: Response): Promise<Response> {
  const querySchema = z.object({
    page: z.coerce.number().optional(),
    per_page: z.coerce.number().optional(),
    sort: z.coerce.string().optional(),
    sort_dir: z.coerce.string().optional(),
    filter: z.coerce.string().optional()
  })

  const { page, per_page, sort, sort_dir, filter } = dataValidation(querySchema, request.query)

  const searchToolUseCase: SearchToolUseCase.UseCase = container.resolve(
    'SearchToolUseCase',
  )

  const tools = await searchToolUseCase.execute({
    page: page ?? 1,
    per_page: per_page ?? 15,
    sort: sort ?? null,
    sort_dir: sort_dir ?? null,
    filter: filter ?? null
  })

  return response.status(201).json(tools)

}
