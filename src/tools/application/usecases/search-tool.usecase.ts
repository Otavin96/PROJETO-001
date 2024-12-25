import "reflect-metadata"
import { ToolsModel } from "@/tools/domain/models/tools.model";
import { PaginationOutputDto, PaginationOutputMapper } from "../dtos/pagination-output.dto";
import { SearchInputDto } from "../dtos/search-input.dto";
import { inject, injectable } from "tsyringe";
import { ToolsRepository } from "@/tools/repositories/tools.repository";

export namespace SearchToolUseCase {
  export type Input = SearchInputDto

  export type Output = PaginationOutputDto<ToolsModel>

  @injectable()
  export class UseCase {
    constructor(
      @inject('ToolRepository')
      private toolsRepository: ToolsRepository,
    ){}

    async execute(input: Input): Promise<Output> {
      const searchResult = await this.toolsRepository.search(input)
      return PaginationOutputMapper.toOutput(searchResult.items, searchResult)
    }
  }
}
