import { dataValidation } from '@/common/infrastructure/validation/zod'
import { Request, Response } from 'express'
import { z } from 'zod'
import { DeleteSupplierUseCase } from '@/suppliers/application/usecases/delete-supplier.usecase'
import { container } from 'tsyringe'

export async function deleteSupplierController(
  request: Request,
  response: Response,
) {
  const deleteSupplierSchemaParams = z.object({
    id: z.string(),
  })

  const { id } = dataValidation(deleteSupplierSchemaParams, request.params)

  const deleteSupplierUseCase: DeleteSupplierUseCase.UseCase =
    container.resolve('DeleteSupplierUseCase')

  await deleteSupplierUseCase.execute({ id })

  response.status(200).json({ message: 'Fornecedor deletado com sucesso!' })
}
