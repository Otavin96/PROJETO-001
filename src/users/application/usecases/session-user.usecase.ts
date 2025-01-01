import { inject, injectable } from 'tsyringe'
import { UserOutput } from '../dtos/user-output.dto'
import { UsersRepository } from '@/users/repositories/users.repository'
import { BadRequestError } from '@/common/domain/erros/bad-request-error'
import { UnauthorizedError } from '@/common/domain/erros/unauthorized-error'
import { compare } from 'bcrypt'

export namespace SessionUsersUseCase {
  export type Input = {
    email: string
    password: string
  }

  export type Output = UserOutput

  @injectable()
  export class UseCase {
    constructor(
      @inject('UsersRepository')
      private usersRepository: UsersRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      if (!input.email || !input.password) {
        throw new BadRequestError('Input data not provided or invalid')
      }

      const user = await this.usersRepository.findByEmail(input.email)

      if (!user) {
        throw new UnauthorizedError('Incorrect email/password')
      }

      const passwordConfirmed = await compare(input.password, user.password)

      if (!passwordConfirmed) {
        throw new UnauthorizedError('Incorrect email/password')
      }

      return user
    }
  }
}
