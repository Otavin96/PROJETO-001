import { Router } from 'express'
import { createUserController } from '../controllers/create-user.controller'
import { getUserController } from '../controllers/get-user.controller'
import { UpdateUserController } from '../controllers/update-user.controller'
import { deleteUserController } from '../controllers/delete-user.controller'

const usersRouter = Router()

usersRouter.post('/', createUserController)

usersRouter.get('/:id', getUserController)

usersRouter.put('/:id', UpdateUserController)

usersRouter.delete('/:id', deleteUserController)

// usersRouter.get('/', searchUserController)

export { usersRouter }
