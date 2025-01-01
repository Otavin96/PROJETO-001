import { Router } from 'express'
import { createStockMovementController } from '../controller/create-stockMovement.controller'
import { GetStockMovementController } from '../controller/get-stockMovement.controller'
import { GetAllStockMovementController } from '../controller/getAll-stockMovement.controller'
import { UpdateStockMovementController } from '../controller/update-stockMovement.controller'
import { DeleteStockMovementController } from '../controller/delete-stockMovement.controller'
import { SearchStockMovementController } from '../controller/search-stockMovement.controller'

const stockMovementRouter = Router()

stockMovementRouter.post('/', createStockMovementController)

stockMovementRouter.get('/:id', GetStockMovementController)

stockMovementRouter.get('/all/', GetAllStockMovementController)

stockMovementRouter.put('/:id', UpdateStockMovementController)

stockMovementRouter.delete('/:id', DeleteStockMovementController)

stockMovementRouter.get('/', SearchStockMovementController)

export { stockMovementRouter }
