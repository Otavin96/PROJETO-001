import { Router } from 'express'
import { createUserController } from '../controllers/create-user.controller'
import { getUserController } from '../controllers/get-user.controller'
import { UpdateUserController } from '../controllers/update-user.controller'
import { deleteUserController } from '../controllers/delete-user.controller'
import { SearchUserController } from '../controllers/search-user.controller'
import { sessionUserController } from '../controllers/session-user.controller'
import { isAuth } from '@/common/infrastructure/http/middlewares/isAuth'

const usersRouter = Router()

usersRouter.post('/', createUserController)

usersRouter.post('/session/', sessionUserController)

usersRouter.get('/:id', isAuth, getUserController)

usersRouter.put('/:id', isAuth, UpdateUserController)

usersRouter.delete('/:id', isAuth, deleteUserController)

usersRouter.get('/', isAuth, SearchUserController)

export { usersRouter }
