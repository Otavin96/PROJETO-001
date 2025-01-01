/* eslint-disable prettier/prettier */
import { stockMovementRouter } from '@/stockMovements/infrasctructure/http/routes/stockMovementRouter'
import { supplierRouter } from '@/suppliers/infrastructure/http/routes/supplier.route'
import { toolsRouter } from '@/tools/infrastructure/http/routes/tools.route'
import { usersRouter } from '@/users/infrastructure/http/routes/users.route'
import Router from 'express'

const routes = Router()

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Ola Dev!' })
})

routes.use('/tools', toolsRouter)
routes.use('/suppliers', supplierRouter)
routes.use('/users', usersRouter)
routes.use('/stockMovement', stockMovementRouter)

export { routes }
