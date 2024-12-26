// import { SupplierOutput } from "../dtos/supplier-output.dto";
// import { injectable, inject } from "tsyringe";
// import { SuppliersRepository } from "@/suppliers/repositories/suppliers.repository";

// export namespace GetAllIdsSupplierUseCase {
//   export type Input = {
//     supplierIds: string[]
//   }

//   export type Output = SupplierOutput

//   @injectable()
//   export class UseCase {
//     constructor(
//       @inject('SupplierRepository')
//       private suppliersRepository: SuppliersRepository,
//     ){}

//     async execute(input: Input): Promise<Output> {
//       const supplier = await this.suppliersRepository
//     }
//   }
// }
