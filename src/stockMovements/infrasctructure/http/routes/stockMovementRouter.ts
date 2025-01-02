import { Router } from 'express'
import { createStockMovementController } from '../controller/create-stockMovement.controller'
import { GetStockMovementController } from '../controller/get-stockMovement.controller'
import { GetAllStockMovementController } from '../controller/getAll-stockMovement.controller'
import { UpdateStockMovementController } from '../controller/update-stockMovement.controller'
import { DeleteStockMovementController } from '../controller/delete-stockMovement.controller'
import { SearchStockMovementController } from '../controller/search-stockMovement.controller'
import { isAuth } from '@/common/infrastructure/http/middlewares/isAuth'

const stockMovementRouter = Router()

stockMovementRouter.post('/', isAuth, createStockMovementController)

stockMovementRouter.get('/:id', isAuth, GetStockMovementController)

stockMovementRouter.get('/all/', isAuth, GetAllStockMovementController)

stockMovementRouter.put('/:id', isAuth, UpdateStockMovementController)

stockMovementRouter.delete('/:id', isAuth, DeleteStockMovementController)

stockMovementRouter.get('/', isAuth, SearchStockMovementController)

export { stockMovementRouter }
