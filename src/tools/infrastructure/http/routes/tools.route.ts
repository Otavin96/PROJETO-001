import { Router } from 'express'
import { createToolController } from '../controllers/create-tool.controller'
import { getToolController } from '../controllers/get-tool.controller'
import { DeleteToolController } from '../controllers/delete-tool.controller'
import { updateToolController } from '../controllers/update-tool.controller'

const toolsRouter = Router()

toolsRouter.post('/', createToolController)
toolsRouter.get('/:id', getToolController)
toolsRouter.delete('/:id', DeleteToolController)
toolsRouter.put('/:id', updateToolController)

export { toolsRouter }
