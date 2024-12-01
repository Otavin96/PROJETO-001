/* eslint-disable prettier/prettier */
import Router from 'express'

const routes = Router()

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Ola Dev!' })
})

export { routes }
