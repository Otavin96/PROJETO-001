import { dataValidation } from '@/common/infrastructure/validation/zod'
import { GetSupplierUseCase } from '@/suppliers/application/usecases/get-supplier.usecase'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function getSupplierController(
  request: Request,
  response: Response,
) {
  const getSupplierSchemaParams = z.object({
    id: z.string(),
  })

  const { id } = dataValidation(getSupplierSchemaParams, request.params)

  container.resolve('SupplierRepository')

  const getSupplierUseCase: GetSupplierUseCase.UseCase =
    container.resolve('GetSupplierUseCase')

  const supplier = await getSupplierUseCase.execute({ id })

  return response.status(200).json(supplier)
}
