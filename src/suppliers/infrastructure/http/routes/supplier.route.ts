import { Router } from 'express'
import { createSupplierController } from '../controllers/create-supplier.controller'
import { getSupplierController } from '../controllers/get-supplier.controller'
import { updateSupplierController } from '../controllers/update-supplier.controller'
import { deleteSupplierController } from '../controllers/delete-supplier.controller'
import { searchSupplierController } from '../controllers/search-supplier.controller'
import { isAuth } from '@/common/infrastructure/http/middlewares/isAuth'

const supplierRouter = Router()

supplierRouter.post('/', isAuth, createSupplierController)

supplierRouter.get('/:id', isAuth, getSupplierController)

supplierRouter.put('/:id', isAuth, updateSupplierController)

supplierRouter.delete('/:id', isAuth, deleteSupplierController)

supplierRouter.get('/', isAuth, searchSupplierController)

export { supplierRouter }
