import { dataValidation } from '@/common/infrastructure/validation/zod'
import { CreateSupplierUseCase } from '@/suppliers/application/usecases/create-supplier.usecase'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function createSupplierController(
  request: Request,
  response: Response,
) {
  const createSupplierBodySchema = z.object({
    name: z.string(),
    description: z.string(),
    contact_email: z.string(),
    phone: z.string(),
    status: z.string(),
  })

  const { name, description, contact_email, phone, status } = dataValidation(
    createSupplierBodySchema,
    request.body,
  )

  container.resolve('SupplierRepository')
  const createSupplierUseCase: CreateSupplierUseCase.UseCase =
    container.resolve('CreateSupplierUseCase')

  const supplier = await createSupplierUseCase.execute({
    name,
    description,
    contact_email,
    phone,
    status,
  })

  return response.status(201).json(supplier)
}
