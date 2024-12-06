/* eslint-disable prettier/prettier */
import { AppError } from "@/common/domain/erros/app-error"

export function dataValidation(schema: any, data: any) {

  /**
   * @param schema objeto com schema de validation para Zod
   * @param data objeto com os dados a serem validados
   * @returns retorna os dados validados
   */

  const validatedData = schema.safeParse(data)

  if (validatedData.success === false) {
    console.error('Invalid data', validatedData.error.format())
    throw new AppError(
      `${validatedData.error.errors.map(err => {
        return `${err.path} => ${err.message}`
      })}`,
    )
  }

  return data
}
