import { Router } from 'express'
import { createSupplierController } from '../controllers/create-supplier.controller'

const supplierRouter = Router()

supplierRouter.post('/', createSupplierController)

export { supplierRouter }
