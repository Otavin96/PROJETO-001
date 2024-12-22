/* eslint-disable prettier/prettier */
import { toolsRouter } from '@/tools/infrastructure/http/routes/tools.route'
import Router from 'express'

const routes = Router()

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Ola Dev!' })
})

routes.use('/tools', toolsRouter)

export { routes }
