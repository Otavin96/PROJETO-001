import { NotFoundError } from '@/common/domain/erros/not-found-error'
import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { env } from '@/common/infrastructure/env'
import { UnauthorizedError } from '@/common/domain/erros/unauthorized-error'

type TokenPayload = {
  iat: number
  exp: number
  sub: string
}

export function isAuth(
  request: Request,
  response: Response,
  _next: NextFunction,
): void {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new NotFoundError('JWT Token is missing.')
  }

  const [, token] = authHeader.split(' ')

  try {
    const decodedToken = verify(token, env.MY_SECRET)

    const { sub } = decodedToken as TokenPayload

    request.user = {
      id: sub,
    }

    return _next()
  } catch (error) {
    throw new UnauthorizedError('Invalid JWT Token.')
  }
}
