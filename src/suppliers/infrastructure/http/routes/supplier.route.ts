import { Router } from 'express'
import { createSupplierController } from '../controllers/create-supplier.controller'
import { getSupplierController } from '../controllers/get-supplier.controller'
import { updateSupplierController } from '../controllers/update-supplier.controller'
import { deleteSupplierController } from '../controllers/delete-supplier.controller'
import { searchSupplierController } from '../controllers/search-supplier.controller'

const supplierRouter = Router()

supplierRouter.post('/', createSupplierController)

supplierRouter.get('/:id', getSupplierController)

supplierRouter.put('/:id', updateSupplierController)

supplierRouter.delete('/:id', deleteSupplierController)

supplierRouter.get('/', searchSupplierController)

export { supplierRouter }
