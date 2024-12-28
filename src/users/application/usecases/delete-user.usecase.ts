import { UsersRepository } from '@/users/repositories/users.repository'
import { inject, injectable } from 'tsyringe'

export namespace DeleteUserUseCase {
  export type Input = {
    id: string
  }

  export type Output = void

  @injectable()
  export class UseCase {
    constructor(
      @inject('UsersRepository')
      private usersRepository: UsersRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      await this.usersRepository.delete(input.id)
    }
  }
}
