import { injectable, inject } from 'tsyringe'
import { UsersRepository } from '../../repositories/users.repository'
import { BadRequestError } from '@/common/domain/erros/bad-request-error'
import { UserOutput } from '../dtos/user-output.dto'
export namespace CreateUsersUseCase {
  export type Input = {
    name: string
    email: string
    password: string
    avatar?: string
  }

  export type Output = UserOutput

  @injectable()
  export class UseCase {
    constructor(
      @inject('UsersRepository')
      private usersRepository: UsersRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      if (!input.name || !input.email || !input.password) {
        throw new BadRequestError('Input data not provided or invalid')
      }

      await this.usersRepository.conflictingEmail(input.email)

      const user = this.usersRepository.create(input)

      const CreatedUser: UserOutput = await this.usersRepository.insert(user)

      return CreatedUser
    }
  }
}
