import { dataValidation } from '@/common/infrastructure/validation/zod'
import { UpdateSupplierUseCase } from '@/suppliers/application/usecases/update-supplier.usecase'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function updateSupplierController(
  request: Request,
  response: Response,
) {
  const updateSupplierSchemaBody = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
  })

  const { name, description } = dataValidation(
    updateSupplierSchemaBody,
    request.body,
  )

  const updateSupplierSchemaParams = z.object({
    id: z.string(),
  })

  const { id } = dataValidation(updateSupplierSchemaParams, request.params)

  const updateSupplierUseCase: UpdateSupplierUseCase.UseCase =
    container.resolve('UpdateSupplierUseCase')

  const supplier = await updateSupplierUseCase.execute({
    id,
    name,
    description,
  })

  response.status(200).json(supplier)
}
