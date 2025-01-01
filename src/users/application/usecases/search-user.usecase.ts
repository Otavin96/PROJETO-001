import 'reflect-metadata'
import {
  PaginationOutputDto,
  PaginationOutputMapper,
} from '@/tools/application/dtos/pagination-output.dto'
import { SearchInputDto } from '@/tools/application/dtos/search-input.dto'
import { UsersModel } from '@/users/domain/models/users.model'
import { UsersRepository } from '@/users/repositories/users.repository'
import { inject, injectable } from 'tsyringe'

export namespace SearchUserUseCase {
  export type Input = SearchInputDto

  export type Output = PaginationOutputDto<UsersModel>

  @injectable()
  export class UseCase {
    constructor(
      @inject('UsersRepository')
      private usersRepository: UsersRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const searchResult = await this.usersRepository.search(input)
      return PaginationOutputMapper.toOutput(searchResult.items, searchResult)
    }
  }
}
