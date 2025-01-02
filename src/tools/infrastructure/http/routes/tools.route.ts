import { Router } from 'express'
import { createToolController } from '../controllers/create-tool.controller'
import { getToolController } from '../controllers/get-tool.controller'
import { DeleteToolController } from '../controllers/delete-tool.controller'
import { updateToolController } from '../controllers/update-tool.controller'
import { SearchToolController } from '../controllers/search-tool.controller'
import { isAuth } from '@/common/infrastructure/http/middlewares/isAuth'

const toolsRouter = Router()

toolsRouter.post('/', isAuth, createToolController)
toolsRouter.get('/:id', isAuth, getToolController)
toolsRouter.delete('/:id', isAuth, DeleteToolController)
toolsRouter.put('/:id', isAuth, updateToolController)
toolsRouter.get('/', isAuth, SearchToolController)

export { toolsRouter }
